import React, { useState, useEffect } from "react";
import ComposeList from "./ComposeList";
import { db } from "./firebase";
import { slugify } from "./utils";

// TODO: remove hardcoded userId after authentication is set up
const userId = "0diqOSAmwzTzccIJFzwJKZihWxc2";

function Nav() {
  const [lists, setLists] = useState([]);
  const [composing, setComposing] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const AddNewList = title => {
    setLoading(true);
    const userRef = db.collection("users").doc(userId);
    userRef.collection("lists").add({
      title,
      path: slugify(title)
    });
    console.log(title);
  };

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar">
        <nav className="sidebar__nav">
          {lists.map(list => (
            <a className="nav-item" key={list.id} href={`/list/${list.path}`}>
              {list.title}
            </a>
          ))}
        </nav>
        <div className="add-list-container">
          {!composing && (
            <button
              onClick={() => setComposing(true)}
              className="button button-secondary button-borderless button-full"
            >
              + Add list
            </button>
          )}
          {composing && (
            <ComposeList
              onCancel={() => setComposing(false)}
              onSubmit={AddNewList}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;
