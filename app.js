var express = require("express");
var path = require("path");
var logger = require("morgan");
const mongoose = require("mongoose");
var config = require('./configuration.js') || {};
const url = process.env.MONGODB_URL || config.mongodb_cloud;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);
const passport = require("passport");
var authenticate = require('./authenticate');
var app = express();
app.use(passport.initialize());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var uploadRouter = require('./routes/uploadRouter');
var dishRouter = require("./routes/dishRouter");
var promoRouter = require("./routes/promoRouter");
var leaderRouter = require("./routes/leaderRouter");
var userRouter = require("./routes/userRouter");
var indexRouter = require("./routes/index");
var favoriteRouter = require("./routes/favoriteRouter");

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);
app.use("/favorite", favoriteRouter);
app.use('/imageUpload',uploadRouter);

module.exports = app;
