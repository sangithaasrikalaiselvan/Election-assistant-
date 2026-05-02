const logger = require("../utils/logger");
const { OPENROUTER_MODEL: DEFAULT_OPENROUTER_MODEL } = require("../config");

const getConfig = () => ({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  model: process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
});

const resolveSdk = () => {
  try {
    // Use require so Jest can mock the SDK in tests.
    return require("@openrouter/sdk");
  } catch (error) {
    logger.warn("OpenRouter SDK not available", { error: error.message });
    return null;
  }
};

const buildMessages = (message, systemPrompt) => {
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: message });
  return messages;
};

const createStreamIterator = async function* (stream) {
  for await (const chunk of stream) {
    const content = chunk.choices?.[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
};

/**
 * Sends a user prompt to OpenRouter and returns a response string.
 * @param {string} message
 * @param {string} systemPrompt
 * @returns {Promise<string | null>}
 */
const getOpenRouterResponse = async (message, systemPrompt) => {
  const { apiKey, model } = getConfig();
  if (!apiKey) {
    return null;
  }

  const sdk = resolveSdk();
  if (!sdk?.OpenRouter) {
    return null;
  }

  try {
    const client = new sdk.OpenRouter({ apiKey });
    const response = await client.chat.send({
      model,
      messages: buildMessages(message, systemPrompt),
    });

    const content = response?.choices?.[0]?.message?.content?.trim();
    return content || null;
  } catch (error) {
    logger.warn("OpenRouter request failed", { error: error.message });
    return null;
  }
};

/**
 * Streams a response from OpenRouter as async chunks.
 * @param {string} message
 * @param {string} systemPrompt
 * @returns {Promise<AsyncGenerator<string>>}
 */
const getOpenRouterStream = async (message, systemPrompt) => {
  const { apiKey, model } = getConfig();
  if (!apiKey) {
    return null;
  }

  const sdk = resolveSdk();
  if (!sdk?.OpenRouter) {
    return null;
  }

  try {
    const client = new sdk.OpenRouter({ apiKey });
    const stream = await client.chat.send({
      model,
      messages: buildMessages(message, systemPrompt),
      stream: true,
    });

    return createStreamIterator(stream);
  } catch (error) {
    logger.warn("OpenRouter streaming failed", { error: error.message });
    return null;
  }
};

module.exports = { getOpenRouterResponse, getOpenRouterStream };
