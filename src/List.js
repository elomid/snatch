import React from "react";
import { useParams } from "react-router-dom";
import ListInfo from "./ListInfo";
import Pages from "./Pages";

function List({ userId }) {
  const { listId } = useParams();
  return (
    <div className="list-wrapper">
      <div className="list">
        <ListInfo userId={userId} listId={listId} />
        <Pages userId={userId} listId={listId} />
      </div>
    </div>
  );
}

export default List;
