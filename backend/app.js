const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes");
const subredditRoutes = require("./routes/subreddit-routes");
const postRoutes = require("./routes/posts-routes");
const commentRoutes = require("./routes/comments-routes");
const feedRoutes = require("./routes/feed-routes");

const HttpError = require("./models/http-error");

const rateLimit = require("express-rate-limit");
const formData = require("express-form-data");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();

// app.use(limiter);
app.use(bodyParser.json());

app.use(cors());
app.options("*", cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subreddits", subredditRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/feed", feedRoutes);

app.use((request, response, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, request, response, next) => {
  if (response.headerSent) {
    return next(error);
  }
  response.status(error.code || 500);
  response.json({ message: error.message || "An unknown error occurred!" });
});

const mongoDBUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gpnra.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoDBUrl)
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.error("failed to start.");
    console.error(err);
  });
