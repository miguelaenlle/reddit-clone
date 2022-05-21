const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const subredditsController = require("../controllers/subreddit-controller");
const checkAuth = require("../middleware/check-auth");
const multerGoogleStorage = require("multer-cloud-storage");

const multer = require("multer");
// const fileStorageEngine = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./images"); //important this is a direct path fron our current file to storage location
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "--" + file.originalname);
//   },
// });

// const upload = multer({ storage: fileStorageEngine });

const upload = multer({
  storage: multerGoogleStorage.storageEngine({
    bucket: "redddit-bucket", //GCS_BUCKET
    projectId: "enhanced-tuner-347902", //GCLOUD_PROJECT
    keyFilename: "./keys/enhanced-tuner-347902-e1303528f500.json", //GSC_KEYFILE, path to a json file,
    destination: (request, file, callback) => {
      const fieldname = file.fieldname;
      if (fieldname === "icon") {
        callback(null, "./icons");
      } else if (fieldname === "banner") {
        callback(null, "./banners");
      }
    },
    filename: (request, file, callback) => {
      callback(
        null,
        Date.now() + "--" + Math.random().toString() + "--" + file.originalname
      );
    },
  }),
});
// create two separate instances

router.post(
  "/",
  checkAuth,

  upload.fields([
    {
      name: "icon",
      maxCount: 1,
    },
    {
      name: "banner",
      maxCount: 1,
    },
  ]),
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
// router.post("/", upload.single("image"), (request, response) => {
//   console.log(request.file);
//   response.send("Single FIle upload success");
// });

router.patch(
  "/:subredditId",
  checkAuth, // will be used to determine if the user is actually the subreddit owner
  [check("newDescription").trim().notEmpty().isLength({ min: 1, max: 300 })],
  subredditsController.updateSubredditInfo
);


router.patch(
  "/:subredditId/banner-upload",
  checkAuth, // will be used to determine if the user is actually the subreddit owner
  upload.single("banner"),
  subredditsController.updateSubredditImage
);
router.patch(
  "/:subredditId/icon-upload",
  checkAuth, // will be used to determine if the user is actually the subreddit owner
  upload.single("icon"),
  subredditsController.updateSubredditIcon
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

router.post("/:subId/join", checkAuth, subredditsController.joinSubreddit);

router.post("/:subId/leave", checkAuth, subredditsController.leaveSubreddit);

module.exports = router;
