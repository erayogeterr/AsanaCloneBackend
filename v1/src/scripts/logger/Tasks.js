const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "task-service" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'v1/src/logs/sections/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'v1/src/logs/sections/info.log', level: 'info' }),
    new winston.transports.File({ filename: 'v1/src/logs/sections/combined.log' }),
    //new winston.transports.Console()
  ],
});

module.exports = logger;
