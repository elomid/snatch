import React from "react";
import ListInfo from "./ListInfo";
import Pages from "./Pages";

function List({ userId }) {
  return (
    <div className="list-wrapper">
      <div className="list">
        <ListInfo />
        <Pages userId={userId} />
      </div>
    </div>
  );
}

export default List;
