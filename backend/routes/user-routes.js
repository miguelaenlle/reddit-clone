const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const usersController = require("../controllers/users-controller");

router.get(
  "/subreddits",
  [check("authToken").notEmpty()],
  usersController.getSubreddits
);

router.get("/:uid", usersController.getUserInformation);

router.get(
  "/",
  [
    check("searchQuery").notEmpty().isLength({ min: 1, max: 300 }),
    check("page").notEmpty().isInt({ min: 0 }),
    check("numResults").notEmpty().isInt({ min: 1, max: 100 }),
  ],
  usersController.searchForUsers
);

module.exports = router;
