/**
 * @fileoverview Utility for local keyword-based intent detection
 */

const INTENT_KEYWORDS = {
  faq: ["faq", "question", "help", "support"],
  registration: ["register", "registration", "enroll", "sign up"],
  nomination: ["nomination", "nominate", "candidate", "ballot"],
  campaigning: ["campaign", "campaigning", "candidates", "rally", "manifesto"],
  voting: ["vote", "voting", "voting day", "ballot", "polling"],
  counting: ["count", "counting", "tabulation"],
  results: ["results", "declare", "certification"],
  timeline: ["timeline", "schedule", "dates", "phases"],
  steps: ["steps", "process", "guide", "how does it work"],
  greeting: ["hello", "hi", "hey", "good morning", "good afternoon"],
};

const INTENT_PRIORITY = [
  "faq",
  "registration",
  "nomination",
  "campaigning",
  "voting",
  "counting",
  "results",
  "timeline",
  "steps",
  "greeting",
];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const keywordToRegex = (keyword) => {
  const escaped = escapeRegex(keyword.trim());
  const pattern = escaped.split(/\s+/).join("\\s+");
  // eslint-disable-next-line security/detect-non-literal-regexp
  return new RegExp(`\\b${pattern}\\b`, "i");
};

/**
 * Detects the intent of a text based on keyword matching.
 * @param {string} text - The input text
 * @returns {string} The detected intent or 'general'
 */
const detectIntent = (text) => {
  const normalized = String(text || "").toLowerCase();
  for (const intent of INTENT_PRIORITY) {
    const keywords = INTENT_KEYWORDS[intent] || [];
    if (keywords.some((keyword) => keywordToRegex(keyword).test(normalized))) {
      return intent;
    }
  }
  return "general";
};

module.exports = { detectIntent };
