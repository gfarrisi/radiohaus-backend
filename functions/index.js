const functions = require("firebase-functions");
const app = require("express")();
const { db } = require("./util/admin");
const {
  getAllEvents,
  createEvent
} = require("./handlers/events");

const cors = require("cors");

app.use(cors());

/* Post Routes */
app.get("/events", getAllEvents); // get posts route
app.post("/event", createEvent); // create post route

exports.api = functions.https.onRequest(app);