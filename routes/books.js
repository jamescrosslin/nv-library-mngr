const express = require("express");
const router = express.Router();
const { Book } = require("../models");

/* GET users listing. */
router.get("/", async (req, res, next) => {
  const books = await Book.findAll();
  res.render("index", { title: "Books" });
});

router.route("/new").get().post();

router.param("id", async (req, res, next, id) => {
  const book = await Book.findByPk(id);
});

router.route("/:id").get().post();

router.post("/:id/delete");

module.exports = router;
