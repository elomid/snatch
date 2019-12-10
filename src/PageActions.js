import React, { useState } from "react";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import { db } from "./firebase";
import ConfirmationModal from "./ConfirmationModal";

function PageActions({ userId, page, lists, listId }) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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

  const handleMove = (userId, pageId, listId) => {
    const pageRef = db
      .collection("users")
      .doc(userId)
      .collection("pages")
      .doc(pageId);
    pageRef.set(
      {
        listId
      },
      { merge: true }
    );
  };

  return (
    <div className="page-actions">
      {showConfirmationModal && (
        <ConfirmationModal
          title={`Delete page?`}
          onCancel={() => {
            setShowConfirmationModal(false);
          }}
          onConfirm={() => handleDelete(userId, page.id)}
          buttonText="Delete page"
        />
      )}
      <button
        onClick={() => toggleArchive(userId, page.id)}
        className="button button-secondary"
      >
        {page.archived ? `Unarchive` : `Archive`}
      </button>
      <button
        onClick={() => setShowConfirmationModal(true)}
        className="button button-secondary"
      >
        Delete
      </button>
      {lists.length > 1 && (
        <Menu>
          <MenuButton className="button button-secondary">
            Move to <span aria-hidden> ▾</span>
          </MenuButton>
          <MenuList className="menu-list">
            {lists
              .filter(list => list.id !== listId)
              .map(list => (
                <MenuItem
                  key={list.id}
                  onSelect={() => handleMove(userId, page.id, list.id)}
                >
                  {list.title}
                </MenuItem>
              ))}
          </MenuList>
        </Menu>
      )}
    </div>
  );
}

export default PageActions;
