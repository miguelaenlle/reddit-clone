const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const subredditsController = require("../controllers/subreddit-controller");
const checkAuth = require("../middleware/check-auth");

router.post(
  "/",
  checkAuth,
  [
    check("subName")
      .notEmpty()
      .toLowerCase()
      .blacklist(" ")
      .isLength({ min: 1, max: 40 }),
    check("description").trim().notEmpty().isLength({ min: 1, max: 300 }),
  ],
  subredditsController.createSubreddit
);

router.get(
  "/",
  [
    check("query").notEmpty().isLength({ min: 1, max: 300 }),
    check("page").notEmpty().isInt({ min: 0 }),
    check("numResults").notEmpty().isInt({ min: 1, max: 100 }),
  ],
  subredditsController.searchForSubreddits
);

router.get(
  "/all",
  [
    check("page").notEmpty().isInt({ min: 0 }),
    check("numResults").notEmpty().isInt({ min: 1, max: 100 }),
  ],
  subredditsController.getAllSubreddits
);


router.get("/:subId", subredditsController.getSubreddit);

router.post(
  "/:subId/join",
  checkAuth,
  subredditsController.joinSubreddit
);

router.post(
  "/:subId/leave",
  checkAuth,
  subredditsController.leaveSubreddit
);



module.exports = router;
