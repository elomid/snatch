import React, { useState, useEffect } from "react";
import ComposeList from "./ComposeList";
import { db } from "./firebase";

// TODO: remove hardcoded userId after authentication is set up
const userId = "0diqOSAmwzTzccIJFzwJKZihWxc2";

function Nav() {
  const [lists, setLists] = useState([]);
  const [composing, setComposing] = useState(false);

  useEffect(() => {
    const userRef = db.collection("users").doc(userId);

    const unsubscribe = userRef.collection("lists").onSnapshot(snap => {
      const docs = [];
      snap.forEach(doc => {
        docs.push({
          ...doc.data(),
          id: doc.id
        });
      });
      setLists(docs);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar">
        <nav className="sidebar__nav">
          {lists.map(list => (
            <a className="nav-item" key={list.id} href={`/list/${list.path}`}>
              {list.displayName}
            </a>
          ))}
        </nav>
        {!composing && (
          <div className="add-list-container">
            <button className="button button-secondary button-borderless button-full">
              + Add list
            </button>
          </div>
        )}
        {composing && null}
      </div>
    </div>
  );
}

export default Nav;
