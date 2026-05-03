/**
 * @fileoverview Controllers for timeline endpoints
 */

const { getTimeline } = require("../services/knowledgeService");
const { success } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Controller to fetch the election timeline.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const timelineController = asyncHandler(async (req, res) => {
  success(res, { timeline: getTimeline() }, "Fetched timeline successfully");
});

module.exports = { timelineController };
