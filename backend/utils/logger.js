const { createLogger, format, transports } = require("winston");

const isTest = process.env.NODE_ENV === "test";

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: isTest
    ? [
        new transports.Console({
          silent: true,
          format: format.combine(format.colorize(), format.simple()),
        }),
      ]
    : [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
      ],
});

module.exports = logger;
