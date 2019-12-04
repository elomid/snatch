import React from "react";
import logo from "./img/logo.svg";
import { userInfo } from "os";

function Header({ user, onSignOut }) {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="snatch logo" />
      </div>
      <div className="user-options">
        <div className="user-photo-container">
          <img
            className="user-photo"
            src={user.photoURL}
            alt={user.displayName}
          />
        </div>
        <button onClick={onSignOut} className="button button-secondary">
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Header;
