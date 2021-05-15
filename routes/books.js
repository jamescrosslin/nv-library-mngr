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

/* GET users listing. */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const queryTerm = req.query.q || '';
    const searchConditions = ['title', 'author', 'genre', 'year'].map((column) => ({
      [column]: { [Op.substring]: queryTerm },
    }));
    const offset = req.query.page || 0;
    const books = await Book.findAll({
      where: { [Op.or]: searchConditions },
      offset: offset * 5,
      limit: 6,
    });
    const more = books.length === 6;
    res.render('index', {
      title: 'Books',
      books: books.slice(0, 5),
      offset,
      more,
    });
  }),
);

router
  .route('/new')
  .get((req, res) => {
    // create a new books form view
    res.render('new-book');
  })
  .post(
    asyncHandler(async ({ body }, res, next) => {
      // under the impression that build method is synchronous
      const bookBuild = Book.build({ ...body });
      try {
        await bookBuild.save();
        res.redirect('/books');
      } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          res.render('new-book', { book: bookBuild, errors: error.errors });
        } else {
          next(error);
        }
      }
    }),
  );

router.param('id', async (req, res, next, id) => {
  try {
    const book = await Book.findByPk(id);
    if (book) {
      req.book = book;
      next();
    } else {
      throw new Error('Cannot find a book with that id.');
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
          res.render('update-book', { book: req.book, errors: error.errors });
        }
      }
    }),
  );

router.post(
  '/:id/delete',
  asyncHandler(async (req, res) => {
    const didDelete = await req.book.destroy();
    if (didDelete) {
      res.redirect('/books');
    } else {
      res.locals.message = `Delete failed. Make sure book with id ${req.book.id} exists.`;
      res.redirect(`/books/${req.id}`);
    }
  }),
);

module.exports = router;
