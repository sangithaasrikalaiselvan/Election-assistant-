const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("../utils/logger");
const { GEMINI_MODEL: DEFAULT_GEMINI_MODEL } = require("../config");

const getConfig = () => ({
  apiKey: process.env.GEMINI_API_KEY || "",
  model: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
});

const buildPrompt = (message, systemPrompt) => {
  if (!systemPrompt) {
    return message;
  }
  return `${systemPrompt}\n\nUser: ${message}`;
};

const createStreamIterator = async function* (stream) {
  for await (const chunk of stream) {
    const text = chunk?.text?.();
    if (text) {
      yield text;
    }
  }
};

const getGeminiResponse = async (message, systemPrompt) => {
  const { apiKey, model } = getConfig();
  if (!apiKey) {
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const client = genAI.getGenerativeModel({ model });
    const result = await client.generateContent(buildPrompt(message, systemPrompt));
    const text = result?.response?.text?.();
    return text ? text.trim() : null;
  } catch (error) {
    logger.warn("Gemini request failed", { error: error.message });
    return null;
  }
};

const getGeminiStream = async (message, systemPrompt) => {
  const { apiKey, model } = getConfig();
  if (!apiKey) {
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const client = genAI.getGenerativeModel({ model });
    if (typeof client.generateContentStream !== "function") {
      return null;
    }

    const result = await client.generateContentStream(buildPrompt(message, systemPrompt));
    const stream = result?.stream;
    if (!stream) {
      return null;
    }

    return createStreamIterator(stream);
  } catch (error) {
    logger.warn("Gemini streaming failed", { error: error.message });
    return null;
  }
};

module.exports = { getGeminiResponse, getGeminiStream };
