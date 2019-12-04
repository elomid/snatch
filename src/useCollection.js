import { useState, useEffect } from "react";
import { db } from "./firebase";

function useCollection({
  userId,
  path,
  order = null,
  filterKey = null,
  filterValue = null
}) {
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const queryPath = "users/" + userId + path;

  useEffect(() => {
    let collectionRef = db.collection(queryPath);
    if (order && !filterKey) {
      collectionRef = db.collection(queryPath).orderBy(order);
    }
    if (!order && filterKey) {
      collectionRef = db
        .collection(queryPath)
        .where(filterKey, "==", filterValue);
    }
    if (order && filterKey) {
      collectionRef = db
        .collection(queryPath)
        .where(filterKey, "==", filterValue)
        .orderBy(order);
    }
    const unsubscribe = collectionRef.onSnapshot(snap => {
      const docs = [];
      snap.forEach(doc => {
        docs.push({
          ...doc.data(),
          id: doc.id
        });
      });
      setDocs(docs);
    });
    setLoading(false);

    return unsubscribe;
  }, [filterKey, filterValue, order, path, queryPath, userId]);

  return [loading, docs];
}

export default useCollection;
