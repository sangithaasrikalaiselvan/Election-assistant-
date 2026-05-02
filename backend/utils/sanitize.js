const sanitizeHtml = require("sanitize-html");

const sanitizeInput = (value) =>
  sanitizeHtml(String(value || ""), {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

module.exports = { sanitizeInput };
