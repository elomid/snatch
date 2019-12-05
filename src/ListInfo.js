import React from "react";

function ListInfo({ userId, listId }) {
  return (
    <div className="list-info">
      <div className="list-title">
        <input className="title-input" value="Inbox" />
      </div>
    </div>
  );
}

export default ListInfo;
