const { validationResult } = require("express-validator");
const {
  getTranslatedChatResponse,
  getTranslatedChatStream,
} = require("../services/chatService");
const { recordLatency, recordError } = require("../utils/metrics");
const { sanitizeInput } = require("../utils/sanitize");
const { sendError, sendSuccess } = require("../utils/response");

const chatStreamController = async (req, res, next) => {
  void next;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 400, "Validation failed", { errors: errors.array() });
  }

  const start = Date.now();
  try {
    const message = sanitizeInput(req.body.message);
    if (!message) {
      return sendError(res, 400, "Message is required");
    }
    const language = sanitizeInput(req.body.language || "en").toLowerCase();

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const { intent, sources, stream } = await getTranslatedChatStream(message, language);

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ type: "done", intent, sources, language })}\n\n`);
    res.end();

    const duration = Date.now() - start;
    recordLatency(duration);
  } catch (error) {
    recordError();
    if (!res.headersSent) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        success: false,
        message: error.message || "Stream failed",
      });
    }
  }
};

const chatController = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 400, "Validation failed", { errors: errors.array() });
  }

  const start = Date.now();
  try {
    const message = sanitizeInput(req.body.message);
    if (!message) {
      return sendError(res, 400, "Message is required");
    }
    const language = sanitizeInput(req.body.language || "en").toLowerCase();
    const response = await getTranslatedChatResponse(message, language);
    sendSuccess(res, response, "Chat response generated");

    const duration = Date.now() - start;
    recordLatency(duration);
  } catch (error) {
    recordError();
    next(error);
  }
};

module.exports = { chatController, chatStreamController };
