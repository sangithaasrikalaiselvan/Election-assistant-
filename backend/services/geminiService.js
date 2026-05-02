const logger = require("../utils/logger");
const { GEMINI_MODEL: DEFAULT_GEMINI_MODEL } = require("../config");

const getConfig = () => ({
  project: process.env.GCP_PROJECT_ID,
  location: process.env.GCP_LOCATION || "asia-south1",
  model: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL || "gemini-1.5-flash",
});

const buildPrompt = (message, systemPrompt) => {
  if (!systemPrompt) return message;
  return `${systemPrompt}\n\nUser: ${message}`;
};

const streamGenerator = async function* (stream) {
  for await (const chunk of stream) {
    const text = chunk?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) yield text;
  }
};

let vertexAI;
let modelClient;
let legacyClient;

const isTestEnv = () =>
  process.env.NODE_ENV === "test" || Boolean(process.env.JEST_WORKER_ID);
const shouldUseVertex = () => !isTestEnv() && Boolean(process.env.GCP_PROJECT_ID);

const getLegacyClient = () => {
  if (!legacyClient) {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    legacyClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return legacyClient;
};

const initClient = () => {
  if (!vertexAI) {
    const { VertexAI } = require("@google-cloud/vertexai");
    const { project, location, model } = getConfig();

    vertexAI = new VertexAI({
      project,
      location,
    });

    modelClient = vertexAI.getGenerativeModel({
      model,
    });
  }
};

const getGeminiResponse = async (message, systemPrompt) => {
  try {
    if (!shouldUseVertex()) {
      if (!process.env.GEMINI_API_KEY) {
        return null;
      }

      const prompt = buildPrompt(message, systemPrompt);
      const model = getLegacyClient().getGenerativeModel({
        model: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL || "gemini-1.5-flash",
      });
      const result = await model.generateContent(prompt);
      const text = result?.response?.text?.();
      return text ? text.trim() : null;
    }

    initClient();

    const prompt = buildPrompt(message, systemPrompt);

    logger.info("Using Vertex AI Gemini model for response generation");

    const result = await modelClient.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    return text ? text.trim() : null;
  } catch (error) {
    logger.warn("Vertex Gemini request failed", { error: error.message });
    return null;
  }
};

const getGeminiStream = async (message, systemPrompt) => {
  try {
    if (!shouldUseVertex()) {
      if (!process.env.GEMINI_API_KEY) {
        return null;
      }

      const prompt = buildPrompt(message, systemPrompt);
      const model = getLegacyClient().getGenerativeModel({
        model: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL || "gemini-1.5-flash",
      });
      const result = await model.generateContentStream(prompt);

      const legacyStream = async function* () {
        for await (const chunk of result.stream) {
          const text = chunk?.text?.();
          if (text) yield text;
        }
      };

      return legacyStream();
    }

    initClient();

    const prompt = buildPrompt(message, systemPrompt);

    logger.info("Streaming response using Vertex AI Gemini");

    const result = await modelClient.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return streamGenerator(result.stream);
  } catch (error) {
    logger.warn("Vertex Gemini streaming failed", { error: error.message });
    return null;
  }
};

module.exports = {
  getGeminiResponse,
  getGeminiStream,
};
