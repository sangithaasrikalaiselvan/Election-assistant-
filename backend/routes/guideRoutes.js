const express = require("express");
const { guideController } = require("../controllers/guideController");

const router = express.Router();

router.get("/", guideController);

module.exports = router;
