const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { chatController, chatStreamController } = require("../controllers/chatController");

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/",
  chatLimiter,
  body("message").isString().trim().isLength({ min: 2, max: 500 }),
  body("language").optional().isString().trim().isLength({ min: 2, max: 10 }),
  chatController
);

router.post(
  "/stream",
  chatLimiter,
  body("message").isString().trim().isLength({ min: 2, max: 500 }),
  body("language").optional().isString().trim().isLength({ min: 2, max: 10 }),
  chatStreamController
);

module.exports = router;
