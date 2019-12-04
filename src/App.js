import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
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

function App() {
  const [lists, setLists] = useState([
    {
      id: "00",
      displayName: "Inbox",
      path: "inbox"
    },
    {
      id: "01",
      displayName: "Must read articles",
      path: "must-read-articles"
    }
  ]);

  return (
    <nav className="App">
      {lists.map(list => (
        <a href={`/list/${list.path}`}>{list.displayName}</a>
      ))}
    </nav>
  );
}

export default App;
