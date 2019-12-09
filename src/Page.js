import React from "react";
import PageLink from "./PageLink";
import PageActions from "./PageActions";
import PageDescription from "./PageDescription";
import PagePublisher from "./PagePublisher";

function Page({ page, userId, lists }) {
  return (
    <li className={page.archived ? "page page--archived" : "page"}>
      {page.publisher && <PagePublisher publisher={page.publisher} />}
      <PageLink url={page.url} title={page.title} />
      <PageDescription description={page.description} />
      <PageActions userId={userId} page={page} lists={lists} />
    </li>
  );
}

export default Page;
