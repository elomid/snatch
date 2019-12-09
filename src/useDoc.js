import { useState, useEffect } from "react";
import { db } from "./firebase";

function useDoc(path) {
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return db.doc(path).onSnapshot(doc => {
      setDoc({
        id: doc.id,
        ...doc.data()
      });
      setLoading(false);
    });
  }, [path]);
  return [loading, doc];
}

export default useDoc;
