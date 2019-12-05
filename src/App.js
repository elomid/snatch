import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import firebase, { db } from "./firebase";
import Header from "./Header";
import Nav from "./Nav";
import List from "./List";

function setUpNewUserAccount(userRef) {
  // create the default "inbox" list for new users
  userRef
    .collection("lists")
    .doc("inbox")
    .set({
      title: "Inbox",
      path: "inbox",
      createdAt: new Date()
    })
    .then(() => {
      // create the first default page for new users
      userRef.collection("pages").add({
        archived: false,
        archivedAt: null,
        createdAt: new Date(),
        deleted: false,
        deletedAt: false,
        description: "here is your first page!",
        listId: "inbox",
        publisher: "Snatch",
        title: "Get started with Snatch",
        url: "https://snatch.page/getstarted"
      });
    })
    .catch(err => console.error(err));
}

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        const userRef = db.collection("users").doc(firebaseUser.uid);
        userRef
          .get()
          .then(doc => {
            if (doc.exists) {
              // user exists, read info from db
              setUser({
                id: doc.id,
                ...doc.data()
              });
              setError(null);
              setLoading(false);
            } else {
              // create new user doc in db
              const dbUser = {
                id: firebaseUser.uid,
                diplayName: firebaseUser.displayName,
                photoUrl: firebaseUser.photoURL,
                email: firebaseUser.email
              };
              userRef
                .set(dbUser, { merge: true })
                .then(() => {
                  setUser(dbUser);
                  setError(null);
                  setLoading(false);
                })
                .then(() => {
                  setUpNewUserAccount(userRef);
                });
            }
          })
          .catch(error => {
            setLoading(false);
            setError(error);
          });
      } else {
        setUser(null);
        setLoading(false);
      }
    });
  }, []);

  return [error, loading, user];
}

function App() {
  const [error, loading, user] = useAuth();

  const handleSignOut = async () => {
    await firebase.auth().signOut();
  };

  return loading ? (
    <div>Loading...</div>
  ) : user ? (
    <div>
      <Header user={user} onSignOut={handleSignOut} />
      <div className="content-wrapper">
        <Router>
          <Nav userId={user.id} />
          <Route path="/list/:listId">
            <List userId={user.id} />
          </Route>
        </Router>
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
