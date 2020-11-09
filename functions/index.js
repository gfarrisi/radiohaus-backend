const functions = require("firebase-functions");
const app = require("express")();
const { db } = require("./util/admin");
const {
  getAllEvents,
  createEvent,
} = require("./handlers/events");
const {
  getAllBlogs
} = require("./handlers/blogs");

const cors = require("cors");

app.use(cors());

/* Post Routes */
app.get("/events", getAllEvents); // get posts route
app.post("/event", createEvent); // create post route
app.get("/blogs", getAllBlogs); // get posts route

exports.api = functions.https.onRequest(app);