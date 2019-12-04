import React from "react";
import logo from "./logo.svg";
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
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
