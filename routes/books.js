const express = require('express');
const {
  Book,
  Sequelize: { Op },
} = require('../models');

const router = express.Router();

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      const reason = err.reason || '';
      err.message = `There was an issue with your book request. ${reason}`;
      next(err);
    }
  };
}

/* GET books listing. */
router.get(
  '/',
  asyncHandler(async ({ query }, res) => {
    const queryTerm = query.q || '';
    // sets a partial match search for each column in the array
    const searchConditions = ['title', 'author', 'genre', 'year'].map((column) => ({
      [column]: { [Op.substring]: queryTerm },
    }));
    const books = await Book.findAll({
      // each column checks a match independently with OR logic
      where: { [Op.or]: searchConditions },
    });
    return res.render('index', {
      title: 'Books',
      books,
      queryTerm,
    });
  }),
);

router
  // all chained methods are for the /new route
  .route('/new')
  .get((_req, res) => {
    res.render('new-book', { title: 'New Book' });
  })
  .post(
    asyncHandler(async ({ body }, res, next) => {
      /*
       * did cost/benefit analysis on create then build on failure
       * or build once and check for save success, went with build once
       */
      const bookBuild = Book.build({ ...body });
      try {
        await bookBuild.save();
        res.redirect('/books');
      } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          res.render('new-book', { title: 'New Book', book: bookBuild, errors: error.errors });
        } else {
          next(error);
        }
      }
    }),
  );

/*
 * using .param allows me to handle id parsing and searching
 * for book by id in one place, standardizing process
 * and reducing errors while staying DRY across routes that use id
 */
router.param('id', async (req, _res, next, id) => {
  try {
    const book = await Book.findByPk(id);
    if (book) {
      // req will carry the book property along to next middleware
      req.book = book;
      next();
    } else {
      const error = new Error('Cannot find a book with that id.');
      error.status = 404;
      throw error;
    }
  } catch (err) {
    next(err);
  }
});

router
  .route('/:id')
  .get((req, res) => {
    res.render('update-book', {
      title: 'Update Book',
      book: req.book,
      message: res.locals.message,
    });
  })
  .post(
    asyncHandler(async (req, res) => {
      try {
        await req.book.update(req.body);
        res.redirect('/books');
      } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          // renders same update-book template with errors on a validation failure
          res.render('update-book', { title: 'Update Book', book: req.book, errors: error.errors });
        }
      }
    }),
  );

router.post(
  '/:id/delete',
  asyncHandler(async (req, res, next) => {
    // returns a number of destoryed rows, 0 or greater
    const didDelete = await req.book.destroy();
    // 0 rows deleted registers falsey, so would skip to else on failure
    if (didDelete) {
      res.redirect('/books');
    } else {
      const error = new Error();
      error.message = `Could not delete the book with id ${req.book.id}`;
      next(error);
    }
  }),
);

module.exports = router;
