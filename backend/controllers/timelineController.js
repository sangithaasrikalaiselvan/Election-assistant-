const { getTimeline } = require("../services/knowledgeService");
const { sendSuccess } = require("../utils/response");

const timelineController = (req, res, next) => {
  try {
    sendSuccess(res, { timeline: getTimeline() }, "Fetched timeline successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { timelineController };
