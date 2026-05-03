/**
 * @fileoverview Controllers for guide endpoints
 */

const { getGuideSteps } = require("../services/knowledgeService");
const { success } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Controller to fetch all guide steps.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const guideController = asyncHandler(async (req, res) => {
  success(res, { steps: getGuideSteps() }, "Fetched guide steps successfully");
});

module.exports = { guideController };
