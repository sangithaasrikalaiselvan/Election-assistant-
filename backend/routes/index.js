const express = require("express");
const chatRoutes = require("./chatRoutes");
const guideRoutes = require("./guideRoutes");
const faqRoutes = require("./faqRoutes");
const timelineRoutes = require("./timelineRoutes");
const translateRoutes = require("./translateRoutes");

const router = express.Router();

router.use("/chat", chatRoutes);
router.use("/guide", guideRoutes);
router.use("/faq", faqRoutes);
router.use("/timeline", timelineRoutes);
router.use("/translate", translateRoutes);

module.exports = router;
