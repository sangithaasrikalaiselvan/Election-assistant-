const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8080;
const ALLOWED_ORIGINS =
  process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:8081";
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || "";
const GOOGLE_TRANSLATE_ENDPOINT =
  process.env.GOOGLE_TRANSLATE_ENDPOINT ||
  "https://translation.googleapis.com/language/translate/v2";
const DIALOGFLOW_PROJECT_ID = process.env.DIALOGFLOW_PROJECT_ID || "";
const DIALOGFLOW_CLIENT_EMAIL = process.env.DIALOGFLOW_CLIENT_EMAIL || "";
const DIALOGFLOW_PRIVATE_KEY = process.env.DIALOGFLOW_PRIVATE_KEY || "";
const DIALOGFLOW_LANGUAGE_CODE = process.env.DIALOGFLOW_LANGUAGE_CODE || "en";
const DIALOGFLOW_SESSION_ID = process.env.DIALOGFLOW_SESSION_ID || "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";
const CACHE_TTL_MS = Number.parseInt(process.env.CACHE_TTL_MS || "300000", 10);
const LOG_LEVEL = process.env.LOG_LEVEL || "info";

module.exports = {
  PORT,
  ALLOWED_ORIGINS,
  GOOGLE_TRANSLATE_API_KEY,
  GOOGLE_TRANSLATE_ENDPOINT,
  DIALOGFLOW_PROJECT_ID,
  DIALOGFLOW_CLIENT_EMAIL,
  DIALOGFLOW_PRIVATE_KEY,
  DIALOGFLOW_LANGUAGE_CODE,
  DIALOGFLOW_SESSION_ID,
  OPENROUTER_API_KEY,
  OPENROUTER_MODEL,
  CACHE_TTL_MS,
  LOG_LEVEL,
};
