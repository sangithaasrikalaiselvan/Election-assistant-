const express = require("express");
const { body } = require("express-validator");
const { translateController } = require("../controllers/translateController");

const router = express.Router();

router.post(
  "/",
  body("text").isString().trim().isLength({ min: 1, max: 1000 }),
  body("language").optional().isString().trim().isLength({ min: 2, max: 10 }),
  translateController
);

module.exports = router;
