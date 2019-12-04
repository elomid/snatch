import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import Page from "./Page";
import useCollection from "./useCollection";

const userId = "0diqOSAmwzTzccIJFzwJKZihWxc2";

function Pages() {
  const [loading, pages] = useCollection({
    userId,
    path: "/pages",
    order: "createdAt",
    filterKey: "listId",
    filterValue: "inbox"
  });

  return (
    <ul className="pages">
      {pages.map(page => (
        <Page key={page.id} page={page} />
      ))}
    </ul>
  );
}

export default Pages;
