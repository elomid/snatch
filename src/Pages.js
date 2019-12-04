import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import Page from "./Page";

const userId = "0diqOSAmwzTzccIJFzwJKZihWxc2";

function Pages() {
  const [pages, setPages] = useState([]);

  // TODO: get pages for the currently selected list
  useEffect(() => {
    const pagesRef = db
      .collection("users")
      .doc(userId)
      .collection("pages");

    const unsubscribe = pagesRef.onSnapshot(snap => {
      const docs = [];
      snap.forEach(doc => {
        docs.push({
          ...doc.data(),
          id: doc.id
        });
      });
      setPages(docs);
    });

    return unsubscribe;
  }, []);

  return (
    <ul className="pages">
      {pages.map(page => (
        <Page key={page.id} page={page} />
      ))}
    </ul>
  );
}

export default Pages;
