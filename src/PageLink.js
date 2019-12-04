import React from "react";

function PageLink({ url, title }) {
  return (
    <a
      className="page-link"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="page-title">{title}</div>
    </a>
  );
}

export default PageLink;
