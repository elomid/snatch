import React, { useState, useEffect } from "react";
import firebase from "./firebase";
import Header from "./Header";
import Nav from "./Nav";
import List from "./List";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithPopup(provider);
  };

  return user ? (
    <div>
      <Header />
      <div className="content-wrapper">
        <Nav />
        <List />
      </div>
    </div>
  ) : (
    <div className="sign-in">
      <h1>Save and organize content from anyhwere on the web</h1>
      <p>
        With Snatch you can save any webpage with one click and access them
        later.
      </p>
      <button onClick={handleSignIn} className="button button-primary">
        Sign in with Google
      </button>
    </div>
  );
}

export default App;
