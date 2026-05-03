/**
 * @fileoverview Controllers for chat endpoints
 */

const {
  getTranslatedChatResponse,
  getTranslatedChatStream,
} = require("../services/chatService");
const { recordLatency } = require("../utils/metrics");
const { success } = require("../utils/response");
const { sanitizeInput } = require("../utils/sanitize");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Handles the chat request inputs.
 * @param {string} message
 * @param {string} language
 * @returns {{sanitizedMessage: string, sanitizedLanguage: string}}
 */
const handleChatRequest = (message, language = "en") => {
  const sanitizedMessage = sanitizeInput(message);
  if (!sanitizedMessage) {
    throw new Error("Message is required");
  }
  const sanitizedLanguage = sanitizeInput(language).toLowerCase();
  return { sanitizedMessage, sanitizedLanguage };
};

/**
 * Chat controller for streaming responses.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const chatStreamController = asyncHandler(async (req, res) => {
  const start = Date.now();
  const { sanitizedMessage, sanitizedLanguage } = handleChatRequest(
    req.body.message,
    req.body.language
  );

  const { intent, sources, stream } = await getTranslatedChatStream(
    sanitizedMessage,
    sanitizedLanguage
  );

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  for await (const chunk of stream) {
    res.write(`data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`);
  }

  res.write(
    `data: ${JSON.stringify({
      type: "done",
      intent,
      sources,
      language: sanitizedLanguage,
    })}\n\n`
  );
  res.end();

  const duration = Date.now() - start;
  recordLatency(duration);
});

/**
 * Chat controller for single responses.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const chatController = asyncHandler(async (req, res) => {
  const start = Date.now();
  const { sanitizedMessage, sanitizedLanguage } = handleChatRequest(
    req.body.message,
    req.body.language
  );
  
  const response = await getTranslatedChatResponse(sanitizedMessage, sanitizedLanguage);
  success(res, response, "Chat response generated");

  const duration = Date.now() - start;
  recordLatency(duration);
});

module.exports = { chatController, chatStreamController };

