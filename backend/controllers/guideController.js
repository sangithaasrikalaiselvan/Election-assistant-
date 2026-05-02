const { getGuideSteps } = require("../services/knowledgeService");
const { sendSuccess } = require("../utils/response");

const guideController = (req, res, next) => {
  try {
    sendSuccess(res, { steps: getGuideSteps() }, "Fetched guide steps successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { guideController };
