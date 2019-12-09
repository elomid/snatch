import React from "react";
import { db } from "./firebase";

function PageActions({ userId, page }) {
  const toggleArchive = (userId, pageId) => {
    let isArchived = false;
    const pageRef = db
      .collection("users")
      .doc(userId)
      .collection("pages")
      .doc(pageId);
    pageRef
      .get()
      .then(doc => {
        if (doc.exists) {
          isArchived = doc.data().archived;
        }
      })
      .then(() => pageRef.update({ archived: !isArchived }));
  };

  const handleDelete = (userId, pageId) => {
    const pageRef = db
      .collection("users")
      .doc(userId)
      .collection("pages")
      .doc(pageId);
    pageRef.delete().then(res => res);
  };

  return (
    <div className="page-actions">
      <button
        onClick={() => toggleArchive(userId, page.id)}
        className="button button-secondary"
      >
        {page.archived ? `Unarchive` : `Archive`}
      </button>
      <button
        onClick={() => handleDelete(userId, page.id)}
        className="button button-secondary"
      >
        Delete
      </button>
      <button className="button button-secondary">Move to</button>
    </div>
  );
}

export default PageActions;
