const express = require("express");
const { faqController } = require("../controllers/faqController");

const router = express.Router();

router.get("/", faqController);

module.exports = router;
