import React, { useState, useEffect } from "react";
import firebase from "./firebase";
import Header from "./Header";
import Nav from "./Nav";
import List from "./List";

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser({
          displayName: user.displayName,
          photoUrl: user.photoURL,
          id: user.uid
        });
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
  }, []);

  return [loading, user];
}

function App() {
  const [loading, user] = useAuth();

  const handleSignOut = async () => {
    await firebase.auth().signOut();
  };

  return loading ? (
    <div>Loading...</div>
  ) : user ? (
    <div>
      <Header user={user} onSignOut={handleSignOut} />
      <div className="content-wrapper">
        <Nav />
        <List />
      </div>
    </div>
  ) : (
    <SignIn />
  );
}

function SignIn() {
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="sign-in">
      <h1>Save and organize content from anyhwere on the web</h1>
      <p>
        With Snatch you can save any webpage with one click and access them
        later.
      </p>
      <button onClick={handleSignIn} className="button button-primary">
        Sign in with Google
      </button>
      {error && (
        <div>
          <p>Sorry, there was a problem. Please try again</p>
          <p>{error.message}</p>
        </div>
      )}
    </div>
  );
}

export default App;
