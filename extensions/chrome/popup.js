/* globals chrome, firebase */
let loading = true;
let error = null;

const loadingHtml = (message = "") => `
<div class="spinner">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>
<div class="loading-message">${message}</div>
`;
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

var endpoint = "https://us-central1-snatch-b94e3.cloudfunctions.net/savePage";

function pageExists(uid, url) {
  var urls = [];
  var pagesRef = db
    .collection("users")
    .doc(uid)
    .collection("pages");

  return new Promise((resolve, reject) => {
    pagesRef
      .where("url", "==", url)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          urls.push(doc.data());
        });
      })
      .then(() => {
        resolve(urls.length > 0);
      })
      .catch(error => {
        reject(error);
      });
  });
}

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
  loading = true;
  error = null;
  let container = document.getElementById("quickstart-user-details-container");
  container.innerHTML = loadingHtml("");

  let signInButton = document.createElement("button");
  signInButton.textContent = "Sign-in with Google";

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var photoURL = user.photoURL;
      var uid = user.uid;

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
            loading = false;
          })
          .catch(error => {
            console.error(error);
            loading = false;
            error = error;
          });
      })();

      chrome.tabs.query(
        { active: true, lastFocusedWindow: true },
        async function(tabs) {
          var url = tabs[0].url;
          pageExists(uid, url).then(exists => {
            if (!exists) {
              container.innerHTML = loadingHtml("Saving");

              (async () => {
                try {
                  const rawResponse = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userId: uid, url: url })
                  });
                  const response = await rawResponse.json();
                  loading = false;
                  error = null;
                  let signOutButton = document.createElement("button");
                  signOutButton.textContent = "Sign out";
                  signOutButton.addEventListener("click", startSignIn);
                  container.innerHTML = "<div>Done.</div>";
                } catch (error) {
                  loading = false;
                  error = error;
                  container.innerHTML =
                    "<div>Something went wrong. Please try again.</div>";
                }
              })();
            } else {
              container.innerHTML = `<div class="paragraph">You already have this page in your Snatch library.</div>
            <div><a class="link" target="_blank" href="https://www.snatch.page">Open Snatch</a></div>`;
            }
          });
        }
      );

      // [END_EXCLUDE]
    } else {
      container.innerHTML = "";
      container.appendChild(signInButton);
      signInButton.addEventListener("click", startSignIn, false);
    }
  });
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
  let quickstartButton = document.getElementById("quickstart-button");
  if (quickstartButton) {
    quickstartButton.disabled = true;
  }
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    startAuth(true);
  }
}

window.onload = function() {
  initApp();
};
