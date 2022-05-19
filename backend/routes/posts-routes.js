const express = require("express");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

const postsController = require("../controllers/posts-controller");

router.post(
  "/",
  checkAuth,
  [
    check("subId").notEmpty(),
    check("title").trim().notEmpty().isLength({
      min: 1,
      max: 40,
    }),
    check("text").isLength({
      min: 0,
      max: 300,
    }),
  ],
  postsController.createNewPost
);

router.get(
  "/",
  [
    check("page").trim().notEmpty().isInt({ min: 0 }),
    check("numResults").notEmpty().isInt({ min: 1, max: 100 }),
    check("sortMode").trim().notEmpty(),
  ],
  postsController.getAllPosts 
);

router.get("/:postId/", [], postsController.getPost);

router.patch(
  "/:postId/",
  checkAuth,
  [
    check("newTitle").trim().notEmpty().isLength({
      min: 1,
      max: 40,
    }),
    check("newText").isLength({
      min: 0,
      max: 300,
    }),
  ],
  postsController.updatePost
);

router.delete("/:postId/", checkAuth, postsController.deletePost);

router.get("/:postId/comments", postsController.getPostComments);

router.post(
  "/:postId/vote",

  checkAuth,

  check("voteDirection").notEmpty().isInt({ min: -1, max: 1 }),

  postsController.voteOnPost
);

module.exports = router;
