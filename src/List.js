import React from "react";
import { useParams } from "react-router-dom";
import useCollection from "./useCollection";
import ListInfo from "./ListInfo";
import Pages from "./Pages";

function List({ userId }) {
  const { listId } = useParams();
  const [loading, lists] = useCollection({
    userId,
    path: "/lists"
  });

  return (
    <div className="list-wrapper">
      <div className="list">
        <ListInfo userId={userId} listId={listId} />
        {lists && <Pages userId={userId} listId={listId} lists={lists} />}
      </div>
    </div>
  );
}

export default List;
