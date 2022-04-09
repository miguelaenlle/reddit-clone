const express = require("express");
const { check, sanitize } = require("express-validator");
const router = express.Router();

const postsController = require("../controllers/posts-controller");

router.post(
  "/",
  [
    check("authToken").notEmpty(),
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
    check("sortMode").trim().notEmpty()
  ],
  postsController.getAllPosts
);

router.get(
  "/all",
  [
    check("page").trim().notEmpty().isInt({ min: 0 }),
    check("numResults").notEmpty().isInt({ min: 1, max: 100 }),
    check("sortMode").trim().notEmpty()
  ],
  postsController.getAllPosts
);

router.get(":postId", postsController.getPost);

router.patch(
  ":postId",
  [
    check("authToken").notEmpty(),
    check("newTitle").trim().notEmpty().isLength({
      min: 1,
      max: 40,
    }),
    check("newDescription").isLength({
      min: 0,
      max: 300,
    }),
  ],
  postsController.updatePost
);

router.delete(
  ":postId",
  [check("authToken").notEmpty()],
  postsController.updatePost
);

router.get(
  ":postId/comments",
  [], // TODO: fill this up
  postsController.updatePostVote
); // WIP

router.post(
  ":postId/vote",
  [
    check("authToken").notEmpty(),
    check("voteDirection").notEmpty().isInt({ min: -1, max: 1 }),
  ],
  postsController.updatePostVote
);

module.exports = router;
