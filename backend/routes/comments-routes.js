const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const commentsController = require("../controllers/comments-controller");

router.post(
  "/",
  checkAuth,
  [
    check("parentIsPost").notEmpty().isBoolean(),
    check("text").notEmpty().isLength({ min: 1, max: 400 }),
  ],
  commentsController.createComment
);

router.get("/:commentId", commentsController.getComment);
router.patch(
  "/:commentId",
  checkAuth,
  check("newCommentContent").notEmpty(),
  commentsController.updateComment
);
router.delete("/:commentId", checkAuth, commentsController.deleteComment);

router.get("/:commentId/comments", commentsController.getChildComments);
router.patch(
  "/:commentId/vote",
  checkAuth,

  check("voteDirection").notEmpty().isInt({ min: -1, max: 1 }),

  commentsController.voteComment
);

router.get(
  "/:commentId/vote-direction",
  checkAuth,

  commentsController.getVoteDirection
);

module.exports = router;
