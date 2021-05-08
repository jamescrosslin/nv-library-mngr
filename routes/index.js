const express = require("express");
const router = express.Router();
const { Book } = require("../models");

/* GET home page. */
router.get("/", async (req, res, next) => {
  res.redirect("/books");
});

module.exports = router;
