const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require("./models/user");
const HttpError = require("./models/httpError");
const authRoutes = require("./routes/authRoutes");
const shopRoutes = require("./routes/shopRoutes");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(authRoutes);
app.use(shopRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({
      message: error.message || "An unknown error occured!",
      error: true,
    });
});

mongoose
  .connect(
    "mongodb+srv://vishal:vishaldogra1598@cluster0-vqiee.mongodb.net/nexter"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
