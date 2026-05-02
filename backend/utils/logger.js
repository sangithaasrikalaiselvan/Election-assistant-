const winston = require("winston");

const isTest = process.env.NODE_ENV === "test" || Boolean(process.env.JEST_WORKER_ID);

const transports = [new winston.transports.Console()];

if (!isTest) {
  const { LoggingWinston } = require("@google-cloud/logging-winston");
  transports.push(new LoggingWinston());
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports,
});

module.exports = logger;
