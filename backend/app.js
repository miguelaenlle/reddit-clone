const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use("/api/auth", authRoutes);

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
