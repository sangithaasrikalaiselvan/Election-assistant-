/**
 * @fileoverview Utility for sanitizing input strings
 */

const sanitizeHtml = require("sanitize-html");

/**
 * Sanitizes input string by stripping HTML tags.
 * @param {any} value
 * @returns {string}
 */
const sanitizeInput = (value) =>
  sanitizeHtml(String(value || ""), {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

module.exports = { sanitizeInput };
