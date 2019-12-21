const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf, colorize } = format;
const ENV = process.env.NODE_ENV;

function getLogger(module) {
  const path =  module.filename.split('\\').slice(-1);

  return winston.createLogger({
    transports: [
      new transports.Console({
        format: combine(
          colorize(),
          label({label: path}),
          printf(({label, level, message, timestamp}) => (
            `${level}: [${label}] ${typeof message === 'object' ? JSON.stringify(message, null, "\t") : message}`
          ))
        )
      })
    ]
  });
}

module.exports = getLogger;