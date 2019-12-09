import React, { useState, useEffect } from "react";
import useDoc from "./useDoc";
import { db } from "./firebase";
import { useHistory } from "react-router-dom";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import "@reach/menu-button/styles.css";

function ListInfo({ userId, listId, listTitle }) {
  const [loading, list] = useDoc("users/" + userId + "/lists/" + listId);
  let history = useHistory();
  const [composing, setComposing] = useState(false);
  const [input, setInput] = useState();
  useEffect(() => {
    if (list) {
      setInput(list.title);
    }
  }, [list, composing]);

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

  const renameList = (userId, listId, newTitle, previousTitle) => {
    if (newTitle.trim()) {
      if (newTitle.trim() !== previousTitle.trim()) {
        const collectionRef = db
          .collection("users")
          .doc(userId)
          .collection("lists")
          .doc(listId);
        collectionRef
          .set(
            {
              title: newTitle
            },
            { merge: true }
          )
          .then(() => {
            setComposing(false);
          });
      }
    } else {
      setInput(previousTitle);
    }
  };

  return (
    <div className="list-info">
      <div className="list-title">
        {!composing && <h2 className="title-input">{list && list.title}</h2>}
        {composing && (
          <form
            onSubmit={e => {
              e.preventDefault();
              renameList(userId, listId, input, list.title);
            }}
            className="list-rename-compose"
          >
            <div>
              <input
                onChange={e => setInput(e.target.value)}
                className="compose-input"
                type="text"
                placeholder="Enter list title..."
                value={input}
              />
            </div>
            <div className="compose-actions">
              <button
                onClick={() => setComposing(false)}
                type="button"
                className="button button-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="button button-primary">
                Rename list
              </button>
            </div>
          </form>
        )}
        {listId !== "inbox" && (
          <Menu>
            <MenuButton className="button button-secondary button-slim">
              Actions <span aria-hidden> ▾</span>
            </MenuButton>
            <MenuList className="menu-list">
              <MenuItem onSelect={() => deleteList(userId, listId)}>
                Delete list
              </MenuItem>
              <MenuItem onSelect={() => setComposing(true)}>
                Rename list
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </div>
    </div>
  );
}

export default ListInfo;
