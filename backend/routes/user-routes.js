const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const usersController = require("../controllers/users-controller");

router.get("/:uid", usersController.getUserInformation);

router.get("/", [
    check("searchQuery").notEmpty(),
    check("page").notEmpty().isInt({min: 0}),
    check("numResults").notEmpty().isInt({min: 1, max: 100})
], usersController.searchForUsers);

module.exports = router;
