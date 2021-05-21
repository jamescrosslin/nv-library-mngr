/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books.js');

const { sequelize } = require('./models');

const app = express();

// authentication and syncronization of library db
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');
    try {
      await sequelize.sync();
      console.log('Models are synced with database');
    } catch (err) {
      console.log('Models could not be synced: ', err);
    }
  } catch (err) {
    console.error("Can't connect to the database: ", err);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// 404 error handler
app.use((_req, res) => {
  const error = new Error();
  error.status = 404;
  error.message = "That page doesn't exist. Please try a different address.";
  res.render('page-not-found', { title: 'Page Not Found', error });
});

// error handler
app.use((error, _req, res, _next) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.locals.message = error.message || 'Sorry, we seem to be having some technical difficulties.';
  res.render('error', { title: 'An error has occured.', error });
});

module.exports = app;
