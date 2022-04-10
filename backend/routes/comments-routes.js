const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const commentsController = require("../controllers/comments-controller");

router.post(
  "/",
  [
    check("authToken").notEmpty(),
    check("parentIsPost").notEmpty().isBoolean(),
    check("text").notEmpty().isLength({ min: 1, max: 40 }),
  ],
  commentsController.createComment
);

router.get("/:commentId", commentsController.getComment);
router.patch(
  "/:commentId",
  [check("authToken").notEmpty(), check("newCommentContent").notEmpty()],
  commentsController.updateComment
);

router.get("/:commentId/comments", commentsController.getChildComments);
router.post(
  "/:commentId/vote",
  [
    check("authToken").notEmpty(),
    check("voteDirection").notEmpty().isInt({ min: -1, max: 1 }),
  ],
  commentsController.voteComment
);

module.exports = router;