const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const feedController = require("../controllers/feed-controller");

router.get(
  "/",
  [
    check("sortMode").notEmpty(),
    check("page").notEmpty().isInt({ min: 0 }),
    check("numResults").notEmpty().isInt({ min: 1, max: 100 }),
  ],
  feedController.getFeedPosts 
);

module.exports = router;
