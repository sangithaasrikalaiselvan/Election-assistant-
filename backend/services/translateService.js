/**
 * @fileoverview Service for translating text using Google Cloud Translation API
 */

const SimpleCache = require("../utils/cache");
const { CACHE_TTL_MS, GOOGLE_TRANSLATE_ENDPOINT } = require("../config");
const logger = require("../utils/logger");

const translateCache = new SimpleCache(CACHE_TTL_MS);

/**
 * Translates text using Google Translate API with caching and fallback.
 * @param {string} text
 * @param {string} targetLanguage
 * @returns {Promise<string>}
 */
const translateText = async (text, targetLanguage) => {
  const normalizedLang = targetLanguage ? targetLanguage.toLowerCase() : "en";
  if (!text || normalizedLang === "en") {
    return text;
  }

  const hasApiKey = Object.prototype.hasOwnProperty.call(
    process.env,
    "GOOGLE_TRANSLATE_API_KEY"
  );
  const apiKey = hasApiKey ? process.env.GOOGLE_TRANSLATE_API_KEY || "" : "";
  const cacheKey = `${apiKey || "no-key"}:${normalizedLang}:${text}`;
  const cached = translateCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  if (!apiKey) {
    const fallback = `[${normalizedLang}] ${text}`;
    translateCache.set(cacheKey, fallback);
    return fallback;
  }

  try {
    const response = await fetch(`${GOOGLE_TRANSLATE_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        target: normalizedLang,
        format: "text",
      }),
    });

    if (!response.ok) {
      throw new Error(`Translate API error: ${response.status}`);
    }

    const payload = await response.json();
    const translated = payload?.data?.translations?.[0]?.translatedText || text;
    translateCache.set(cacheKey, translated);
    return translated;
  } catch (error) {
    logger.warn("Translate API request failed", { error: error.message });
    const fallback = `[${normalizedLang}] ${text}`;
    translateCache.set(cacheKey, fallback);
    return fallback;
  }
};

module.exports = { translateText };
