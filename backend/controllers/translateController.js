/**
 * @fileoverview Controllers for translation endpoints
 */

const { translateText } = require("../services/translateService");
const { sanitizeInput } = require("../utils/sanitize");
const { error, success } = require("../utils/response");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Controller for translating text.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const translateController = asyncHandler(async (req, res) => {
  const text = sanitizeInput(req.body.text);
  if (!text) {
    return error(res, 400, "Text is required");
  }
  const language = sanitizeInput(req.body.language || "en").toLowerCase();
  const translated = await translateText(text, language);
  success(res, { text: translated, language }, "Translation completed");
});

module.exports = { translateController };

