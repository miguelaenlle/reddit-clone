const express = require("express");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

const postsController = require("../controllers/posts-controller");
const multerGoogleStorage = require("multer-cloud-storage");

const multer = require("multer");

const upload = multer({
  storage: multerGoogleStorage.storageEngine({
    bucket: "redddit-bucket", //GCS_BUCKET
    projectId: "enhanced-tuner-347902", //GCLOUD_PROJECT
    keyFilename: "./keys/enhanced-tuner-347902-e1303528f500.json", //GSC_KEYFILE, path to a json file,
    destination: (request, file, callback) => {
      callback(null, "./post-images");
    },
    filename: (request, file, callback) => {
      callback(
        null,
        Date.now() + "--" + Math.random().toString() + "--" + file.originalname
      );
    },
  }),
});

router.post(
  "/",
  checkAuth,
  upload.array("images", 10), // optional
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

router.patch(
  "/:postId/vote",

  checkAuth,

  check("voteDirection").notEmpty().isInt({ min: -1, max: 1 }),

  postsController.voteOnPost
);

router.get(
  "/:postId/vote-direction",
  checkAuth,
  postsController.getVoteDirection
);

module.exports = router;
