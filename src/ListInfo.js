import React from "react";
import useDoc from "./useDoc";
import { db } from "./firebase";
import { useHistory } from "react-router-dom";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";

function ListInfo({ userId, listId }) {
  const [loading, list] = useDoc("users/" + userId + "/lists/" + listId);
  let history = useHistory();

  const deleteList = (userId, listId) => {
    history.push("/inbox");
    const collectionRef = db
      .collection("users")
      .doc(userId)
      .collection("lists")
      .doc(listId);
    collectionRef.delete().then(() => {
      if (history[history.length - 1] !== "/inbox") {
        history.push("/inbox");
      }
    });
  };

  return (
    <div className="list-info">
      <div className="list-title">
        <input className="title-input" value={list && list.title} />
        <Menu>
          <MenuButton className="button button-secondary">
            Actions <span aria-hidden>▾</span>
          </MenuButton>
          <MenuList className="menu-list">
            <MenuItem onSelect={() => deleteList(userId, listId)}>
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
}

export default ListInfo;
