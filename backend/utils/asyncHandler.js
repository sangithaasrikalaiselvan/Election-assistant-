/**
 * @fileoverview Wrapper to catch errors in async route handlers
 */

/**
 * Wraps an async route handler to catch errors and pass them to the next middleware.
 * @param {Function} fn - The async route handler
 * @returns {import("express").RequestHandler}
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
