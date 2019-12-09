import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
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
            <NavItem userId={userId} list={list} />
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

function NavItem({ userId, list }) {
  const [loading, pages] = useCollection({
    userId,
    path: "/pages",
    filterKey: "listId",
    filterValue: list.id
  });

  const unarchivedPages = pages.filter(page => !page.archived);

  return (
    <NavLink
      className="nav-item"
      activeClassName="nav-item--active"
      key={list.id}
      to={`/list/${list.id}`}
    >
      <div className="nav-item__content">
        <div
          style={{
            maxWidth: "75%",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {list.title}
        </div>
        {unarchivedPages && (
          <div
            style={{
              padding: "2px 6px",
              border: "1px solid transparent",
              width: "32px",
              textAlign: "center",
              background: "white",
              borderRadius: "4px",
              fontSize: "11px"
            }}
          >
            {unarchivedPages.length}
          </div>
        )}
      </div>
    </NavLink>
  );
}

export default Nav;
