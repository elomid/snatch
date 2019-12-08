import React from "react";
import useDoc from "./useDoc";

function ListInfo({ userId, listId }) {
  const [loading, list] = useDoc("users/" + userId + "/lists/" + listId);

  return (
    <div className="list-info">
      <div className="list-title">
        <input className="title-input" value={list && list.title} />
      </div>
    </div>
  );
}

export default ListInfo;
