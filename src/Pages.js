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
  const [showArchived, setShowArchived] = useState(false);

  const unarchivedPages = pages.filter(page => !page.archived);
  const archivedPages = pages.filter(page => page.archived);

  const toggleShowArchived = () => {
    setShowArchived(currentShowArchived => !currentShowArchived);
  };

  return (
    <div>
      {!loading && (
        <div>
          <div>
            <ul className="pages">
              {unarchivedPages.map(page => (
                <Page key={page.id} page={page} userId={userId} />
              ))}
            </ul>
            {archivedPages.length > 0 && (
              <button
                className="button button-secondary"
                onClick={toggleShowArchived}
              >
                {showArchived ? "Hide" : "Show"} {archivedPages.length} archived{" "}
                {archivedPages.length === 1 ? "item" : "items"}
              </button>
            )}
          </div>
          {showArchived && (
            <div>
              <ul className="pages pages--archived">
                {archivedPages.map(page => (
                  <Page key={page.id} page={page} userId={userId} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Pages;
