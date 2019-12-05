import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";
import ComposeList from "./ComposeList";
import { db } from "./firebase";
import { slugify } from "./utils";
import useCollection from "./useCollection";

function Nav({ userId }) {
  const [listsLoading, lists] = useCollection({
    userId,
    path: "/lists",
    order: "createdAt"
  });
  const [composing, setComposing] = useState(false);
  const [loading, setLoading] = useState(false);

  const AddNewList = title => {
    setLoading(true);
    const userRef = db.collection("users").doc(userId);
    userRef
      .collection("lists")
      .add({
        title,
        path: slugify(title),
        createdAt: new Date()
      })
      .then(() => {
        setLoading(false);
        setComposing(false);
      });
  };

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar">
        <nav className="sidebar__nav">
          {lists.map(list => (
            <NavLink
              className="nav-item"
              activeClassName="nav-item--active"
              key={list.id}
              to={`/list/${list.path}`}
            >
              {list.title}
            </NavLink>
          ))}
        </nav>
        <div className="add-list-container">
          {!composing && !loading && (
            <button
              onClick={() => setComposing(true)}
              className="button button-secondary button-borderless button-full"
            >
              + Add list
            </button>
          )}
          {composing && !loading && (
            <ComposeList
              onCancel={() => setComposing(false)}
              onSubmit={AddNewList}
            />
          )}
          {/* {TODO: enhance loading state} */}
          {loading && <div>Loading</div>}
        </div>
      </div>
    </div>
  );
}

export default Nav;
