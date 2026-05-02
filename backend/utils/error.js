const logger = require("./logger");
const { sendError } = require("./response");

const notFound = (req, res) => sendError(res, 404, "Not found");

const errorHandler = (err, req, res, next) => {
  void next;
  const status = err.status || 500;
  const message = err.message || "Server error";
  logger.error("Unhandled error", { status, message });
  sendError(res, status, message);
};

module.exports = { notFound, errorHandler };
