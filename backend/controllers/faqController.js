const { getFaq } = require("../services/knowledgeService");
const { sendSuccess } = require("../utils/response");

const faqController = (req, res, next) => {
  try {
    sendSuccess(res, { faq: getFaq() }, "Fetched FAQs successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { faqController };
