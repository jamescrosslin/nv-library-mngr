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
      const bookBuild = await Book.build({ ...body });
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
      req.id = book;
      next();
    } catch (err) {
      err.reason = "Cannot find a book with that id.";
      next(err);
    }
  })
);

router
  .route("/:id")
  .get((req, res) => {})
  .post();

router.post("/:id/delete");

module.exports = router;
