/**
 * @fileoverview Controllers for FAQ endpoints
 */

const { getFaq } = require("../services/knowledgeService");
const { success } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Controller to fetch all FAQs.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const faqController = asyncHandler(async (req, res) => {
  success(res, { faq: getFaq() }, "Fetched FAQs successfully");
});

module.exports = { faqController };
