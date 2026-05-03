/**
 * @fileoverview Global error handler middlewares
 */

const logger = require("../utils/logger");
const { error } = require("../utils/response");

/**
 * 404 Not Found middleware.
 */
const notFound = (req, res) => error(res, 404, "Not found");

/**
 * Global error handler middleware.
 */
const errorHandler = (err, req, res, next) => {
  void next;
  const status = err.status || 500;
  const message = err.message || "Server error";
  logger.error("Unhandled error", { status, message });
  error(res, status, message);
};

module.exports = { notFound, errorHandler };
