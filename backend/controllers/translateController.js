const { validationResult } = require("express-validator");
const { translateText } = require("../services/translateService");
const { sanitizeInput } = require("../utils/sanitize");
const { sendError, sendSuccess } = require("../utils/response");

const translateController = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 400, "Validation failed", { errors: errors.array() });
  }

  try {
    const text = sanitizeInput(req.body.text);
    if (!text) {
      return sendError(res, 400, "Text is required");
    }
    const language = sanitizeInput(req.body.language || "en").toLowerCase();
    const translated = await translateText(text, language);
    sendSuccess(res, { text: translated, language }, "Translation completed");
  } catch (error) {
    next(error);
  }
};

module.exports = { translateController };
