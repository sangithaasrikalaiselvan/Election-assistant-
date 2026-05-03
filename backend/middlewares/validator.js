/**
 * @fileoverview Centralized validation middleware
 */

const { validationResult } = require("express-validator");
const { error } = require("../utils/response");

/**
 * Middleware to check for validation errors from express-validator.
 * Returns a 400 Bad Request response if validation fails.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, 400, "Validation failed", { errors: errors.array() });
  }
  next();
};

module.exports = { validateRequest };
