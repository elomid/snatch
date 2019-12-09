import React from "react";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import { db } from "./firebase";

function PageActions({ userId, page, lists }) {
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
      <ListsMenu lists={lists} />
    </div>
  );
}

function ListsMenu({ lists }) {
  return (
    <Menu>
      <MenuButton className="button button-secondary">
        Actions <span aria-hidden>▾</span>
      </MenuButton>
      <MenuList className="menu-list">
        {lists.map(list => (
          <MenuItem onSelect={() => alert(list.title)}>{list.title}</MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

export default PageActions;
