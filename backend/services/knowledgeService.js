const fs = require("fs");
const path = require("path");

const knowledgePath = path.join(__dirname, "..", "data", "knowledgeBase.json");
let knowledgeBase = null;

/**
 * Loads the knowledge base from disk.
 * @returns {object}
 */
const loadKnowledgeBase = () => {
  if (!knowledgeBase) {
    const raw = fs.readFileSync(knowledgePath, "utf-8");
    knowledgeBase = JSON.parse(raw);
  }
  return knowledgeBase;
};

/**
 * Returns the step-by-step guide entries.
 * @returns {Array}
 */
const getGuideSteps = () => loadKnowledgeBase().guideSteps;

/**
 * Returns timeline entries.
 * @returns {Array}
 */
const getTimeline = () => loadKnowledgeBase().timeline;

/**
 * Returns FAQ entries.
 * @returns {Array}
 */
const getFaq = () => loadKnowledgeBase().faq;

/**
 * Finds a matching FAQ item by keyword.
 * @param {string} text
 * @returns {object | undefined}
 */
const findFaqByKeyword = (text) => {
  const normalized = text.toLowerCase();
  return getFaq().find((item) =>
    item.keywords?.some((keyword) => normalized.includes(keyword))
  );
};

module.exports = {
  getGuideSteps,
  getTimeline,
  getFaq,
  findFaqByKeyword,
};
