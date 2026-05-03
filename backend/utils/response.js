/**
 * @fileoverview Standard API response formats
 */

/**
 * Sends a standard success JSON response.
 * @param {import("express").Response} res
 * @param {any} data
 * @param {string} [message="Success"]
 */
const success = (res, data, message = "Success") =>
  res.json({
    success: true,
    data,
    message,
  });

/**
 * Sends a standard error JSON response.
 * @param {import("express").Response} res
 * @param {number} status
 * @param {string} message
 * @param {any} [data]
 */
const error = (res, status, message, data) => {
  const payload = {
    success: false,
    message,
  };

  if (data !== undefined) {
    payload.data = data;
  }

  return res.status(status).json(payload);
};

module.exports = { success, error };
