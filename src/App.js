import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "./App.css";

// Firebase configuration for snatch-b94e3
const firebaseConfig = {
  apiKey: "AIzaSyB2rRbMgGNT-Za0SfEMekz4M01nXK9_yFA",
  authDomain: "snatch-b94e3.firebaseapp.com",
  databaseURL: "https://snatch-b94e3.firebaseio.com",
  projectId: "snatch-b94e3",
  storageBucket: "snatch-b94e3.appspot.com",
  messagingSenderId: "104535857240",
  appId: "1:104535857240:web:d3f416720f9dc4125ad22d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// remove hardcoded userId after authentication is set up
const userId = "0diqOSAmwzTzccIJFzwJKZihWxc2";

function App() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const userRef = db.collection("users").doc(userId);

    const unsubscribe = userRef.collection("lists").onSnapshot(snap => {
      const docs = [];
      snap.forEach(doc => {
        docs.push({
          ...doc.data(),
          id: doc.id
        });
      });
      setLists(docs);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="sidebar">
      <nav className="sidebar__nav">
        {lists.map(list => (
          <a className="nav-item" key={list.id} href={`/list/${list.path}`}>
            {list.displayName}
          </a>
        ))}
      </nav>
    </div>
  );
}

export default App;
