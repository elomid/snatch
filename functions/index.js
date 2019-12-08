const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const got = require("got");
const cors = require("cors")({ origin: true });

const metascraper = require("metascraper")([
  require("metascraper-author")(),
  require("metascraper-date")(),
  require("metascraper-description")(),
  require("metascraper-image")(),
  require("metascraper-logo")(),
  require("metascraper-clearbit")(),
  require("metascraper-publisher")(),
  require("metascraper-title")(),
  require("metascraper-url")()
]);

const extractMetaDataFromUrl = async targetUrl => {
  const { body: html, url } = await got(targetUrl);
  const metadata = await metascraper({ html, url });
  return metadata;
};

exports.savePage = functions.https.onRequest((request, response) => {
  // Receives POST reqeuests with the url and userId
  // Writes a new page to the default "inbox" list of the user
  cors(request, response, () => {
    if (request.method !== "POST") {
      return response.status(400).json({
        message: "Not allowed"
      });
    }

    if (request.method === "POST") {
      if (request.body.url) {
        try {
          const userId = request.body.userId;
          (async () => {
            const data = await extractMetaDataFromUrl(request.body.url);
            db.collection("users")
              .doc(userId)
              .collection("pages")
              .add({
                archived: false,
                archivedAt: null,
                createdAt: new Date(),
                deleted: false,
                deletedAt: null,
                description: data.description,
                listId: "inbox",
                publisher: data.publisher,
                title: data.title,
                url: data.url
              })
              .then(writeResult => {
                return response.status(200).json({ message: writeResult });
              })
              .catch(err => err);
          })();
        } catch (error) {
          return response.status(500).json({
            message: error
          });
        }
      }
    }
  });
});
