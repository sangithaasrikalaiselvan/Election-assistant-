/**
 * @fileoverview Structured logging utility using Winston
 */

const winston = require("winston");

const isTest = process.env.NODE_ENV === "test" || Boolean(process.env.JEST_WORKER_ID);
const hasCloudCredentials = Boolean(
  process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.K_SERVICE
);

const transports = [new winston.transports.Console()];

if (!isTest && hasCloudCredentials) {
  const { LoggingWinston } = require("@google-cloud/logging-winston");
  transports.push(new LoggingWinston());
}

/**
 * Configured Winston logger instance.
 * @type {winston.Logger}
 */
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports,
});

module.exports = logger;
