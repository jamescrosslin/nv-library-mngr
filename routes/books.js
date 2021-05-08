const express = require("express");
const router = express.Router();
const { Book } = require("../models");

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
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
          res.render("new-book", {});
        }
      }
    })
  );

router.param("id", async (req, res, next, id) => {
  const book = await Book.findByPk(id);
  next();
});

router.route("/:id").get().post();

router.post("/:id/delete");

module.exports = router;
