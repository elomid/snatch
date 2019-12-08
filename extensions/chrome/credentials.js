/* globals chrome, firebase */

// Initialize Firebase
var config = {
  apiKey: "AIzaSyB2rRbMgGNT-Za0SfEMekz4M01nXK9_yFA",
  authDomain: "snatch-b94e3.firebaseapp.com",
  databaseURL: "https://snatch-b94e3.firebaseio.com",
  projectId: "snatch-b94e3",
  storageBucket: "snatch-b94e3.appspot.com",
  messagingSenderId: "104535857240",
  appId: "1:104535857240:web:d3f416720f9dc4125ad22d"
};
firebase.initializeApp(config);

var db = firebase.firestore();

/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 *
 * The core initialization is in firebase.App - this is the glue class
 * which stores configuration. We provide an app name here to allow
 * distinguishing multiple app instances.
 *
 * This method also registers a listener with firebase.auth().onAuthStateChanged.
 * This listener is called when the user is signed in or out, and that
 * is where we update the UI.
 *
 * When signed in, we also authenticate to the Firebase Realtime Database.
 */

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

function initApp() {
  // Listen for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      (async function createOrLocateUser(uid) {
        const userRef = db.collection("users").doc(uid);
        userRef
          .get()
          .then(doc => {
            if (!doc.exists) {
              // create new user doc in db
              const dbUser = {
                id: uid,
                diplayName: displayName,
                photoUrl: photoURL,
                email: email
              };
              userRef.set(dbUser, { merge: true }).then(() => {
                setUpNewUserAccount(userRef);
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      })();

      // [START_EXCLUDE]
      document.getElementById("quickstart-button").textContent = "Sign out";
      document.getElementById("quickstart-sign-in-status").textContent =
        "Signed in";
      document.getElementById(
        "quickstart-account-details"
      ).textContent = JSON.stringify(user, null, "  ");
      // [END_EXCLUDE]
    } else {
      // Let's try to get a Google auth token programmatically.
      // [START_EXCLUDE]
      document.getElementById("quickstart-button").textContent =
        "Sign-in with Google";
      document.getElementById("quickstart-sign-in-status").textContent =
        "Signed out";
      document.getElementById("quickstart-account-details").textContent =
        "null";
      // [END_EXCLUDE]
    }
    document.getElementById("quickstart-button").disabled = false;
  });
  // [END authstatelistener]

  document
    .getElementById("quickstart-button")
    .addEventListener("click", startSignIn, false);
}

/**
 * Start the auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startAuth(interactive) {
  // Request an OAuth token from the Chrome Identity API.
  chrome.identity.getAuthToken({ interactive: !!interactive }, function(token) {
    if (chrome.runtime.lastError && !interactive) {
      console.log("It was not possible to get a token programmatically.");
    } else if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (token) {
      // Authorize Firebase with the OAuth Access Token.
      var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      firebase
        .auth()
        .signInWithCredential(credential)
        .catch(function(error) {
          // The OAuth token might have been invalidated. Lets' remove it from cache.
          if (error.code === "auth/invalid-credential") {
            chrome.identity.removeCachedAuthToken({ token: token }, function() {
              startAuth(interactive);
            });
          }
        });
    } else {
      console.error("The OAuth Token was null");
    }
  });
}

/**
 * Starts the sign-in process.
 */
function startSignIn() {
  document.getElementById("quickstart-button").disabled = true;
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    startAuth(true);
  }
}

window.onload = function() {
  initApp();
};
