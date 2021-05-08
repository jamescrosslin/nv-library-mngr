const express = require("express");
const router = express.Router();
const { Book } = require("../models");

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      const reason = err.reason || "";
      err.message = `There was an issue with your book request. ${reason}`;
      next(err);
    }
  };
}

/* GET users listing. */
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const books = await Book.findAll();
    res.render("index", { title: "Books", books });
  })
);

router
  .route("/new")
  .get((req, res) => {
    //create a new books form view
    res.render("new-book");
  })
  .post(
    asyncHandler(async ({ body }, res) => {
      // under the impression that build method is synchronous
      const bookBuild = Book.build({ ...body });
      try {
        const book = await newBook.save();
        res.redirect(`/book/${book.id}`);
      } catch (error) {
        if (error.name === "SequelizeValidationError") {
          res.render("new-book", { book: bookBuild, error });
        }
      }
    })
  );

router.param(
  "id",
  asyncHandler(async (req, res, next, id) => {
    try {
      const book = await Book.findByPk(id);
      req.book = book;
      next();
    } catch (err) {
      err.reason = "Cannot find a book with that id.";
      next(err);
    }
  })
);

router
  .route("/:id")
  .get((req, res) => {
    res.render("update-book", { title: "Update Book", book: req.book });
  })
  .post(
    asyncHandler(async (req, res) => {
      try {
        await req.book.update(req.body);
        res.redirect(`/books/${req.book.id}`);
      } catch (error) {
        if (error.name === "SequelizeValidationError") {
          return res.render("update-book", { book: bookBuild, error });
        }
        next(err);
      }
    })
  );

router.post("/:id/delete");

module.exports = router;
