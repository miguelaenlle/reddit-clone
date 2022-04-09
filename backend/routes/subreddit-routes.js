const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const subredditsController = require("../controllers/subreddit-controller");

router.post(
  "/",
  [
    check("authToken").notEmpty(),
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

router.get(
  "/:subId/posts",
  [
    check("query").notEmpty().isLength({ min: 1, max: 300 }),
    check("page").notEmpty().isInt({ min: 0 }),
    check("numResults").notEmpty().isInt({ min: 1, max: 100 }),
  ],
  subredditsController.getSubredditPosts
);

router.post(
  "/:subId/join",
  [check("authToken").notEmpty()],
  subredditsController.joinSubreddit
);

router.post(
  "/:subId/leave",
  [check("authToken").notEmpty()],
  subredditsController.leaveSubreddit
);



module.exports = router;
