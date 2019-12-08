/* global chrome, firebase */

var firebaseConfig = {
  apiKey: "AIzaSyB2rRbMgGNT-Za0SfEMekz4M01nXK9_yFA",
  authDomain: "snatch-b94e3.firebaseapp.com",
  databaseURL: "https://snatch-b94e3.firebaseio.com",
  projectId: "snatch-b94e3",
  storageBucket: "snatch-b94e3.appspot.com",
  messagingSenderId: "104535857240",
  appId: "1:104535857240:web:d3f416720f9dc4125ad22d"
};

firebase.initializeApp(firebaseConfig);

const root = document.getElementById("root");

const signInButton = document.getElementById("signin");

signInButton.addEventListener("click", signInWithGoogle);

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

if (true) {
  // show login screen
}

// send usreId dynamically after enabling auth in extension
const userId = "LNcNroIFjzdd42bxklUT94nXK7x1";
const endpoint = "https://us-central1-snatch-b94e3.cloudfunctions.net/savePage";

chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
  var url = tabs[0].url;
  var loading = true;
  root.innerHTML = "<div>Saving...</div>";
  (async () => {
    const rawResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId, url: url })
    });
    const content = await rawResponse.json();
    loading = false;
    root.innerHTML = "<div>Done!</div>";
  })();
});
