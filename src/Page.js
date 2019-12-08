import React from "react";
import PageLink from "./PageLink";
import PageActions from "./PageActions";
import PageDescription from "./PageDescription";
import PagePublisher from "./PagePublisher";

function Page({ page }) {
  return (
    <li className="page">
      {page.publisher && <PagePublisher publisher={page.publisher} />}
      <PageLink url={page.url} title={page.title} />
      <PageDescription description={page.description} />
      <PageActions />
    </li>
  );
}

export default Page;
