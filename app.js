const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const booksRouter = require("./routes/books.js");

const { sequelize } = require("./models");

const app = express();
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database");
    try {
      await sequelize.sync();
      console.log("Models are synced with database");
    } catch (err) {
      console.log("Models could not be synced: ", err);
    }
  } catch (err) {
    console.error("Can't connect to the database: ", err);
  }
})();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", booksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const error = new Error();
  error.status = 404;
  error.message = "That page doesn't exist. Please try a different address.";
  res.render("page-not-found", { title: "Page Not Found", error });
});

// error handler
app.use(function (error, req, res, next) {
  error.status = error.status || 500;
  res.status(error.status);
  res.locals.message =
    "Sorry, we seem to be having some technical difficulties.";
  res.render("error", { error });
});

module.exports = app;
