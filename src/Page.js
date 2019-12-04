import React from "react";
import PageLink from "./PageLink";
import PageActions from "./PageActions";
import PageDescription from "./PageDescription";
import PagePublisher from "./PagePublisher";

function Page() {
  return (
    <li className="page">
      <PagePublisher />
      <PageLink />
      <PageDescription />
      <PageActions />
    </li>
  );
}

export default Page;
