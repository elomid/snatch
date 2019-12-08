import { useState, useEffect } from "react";
import { db } from "./firebase";

function useDoc(path) {
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.doc(path)
      .get()
      .then(doc => {
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
