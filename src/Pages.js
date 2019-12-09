import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import Page from "./Page";
import useCollection from "./useCollection";

function Pages({ userId, listId }) {
  const [loading, pages] = useCollection({
    userId,
    path: "/pages",
    order: "createdAt",
    filterKey: "listId",
    filterValue: listId
  });

  return (
    <ul className="pages">
      {pages.map(page => (
        <Page key={page.id} page={page} userId={userId} />
      ))}
    </ul>
  );
}

export default Pages;
