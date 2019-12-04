import React from "react";
import Header from "./Header";
import Nav from "./Nav";
import List from "./List";

function App() {
  return (
    <div>
      <Header />
      <div className="content-wrapper">
        <Nav />
        <List />
      </div>
    </div>
  );
}

export default App;
