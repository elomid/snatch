import React from "react";
import ListInfo from "./ListInfo";
import Pages from "./Pages";

function List() {
  return (
    <div className="list-wrapper">
      <div className="list">
        <ListInfo />
        <Pages />
      </div>
    </div>
  );
}

export default List;
