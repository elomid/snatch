import React from "react";
import logo from "./img/logo.svg";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="snatch logo" />
      </div>
      <button className="button button-secondary">Sign out</button>
    </header>
  );
}

export default Header;
