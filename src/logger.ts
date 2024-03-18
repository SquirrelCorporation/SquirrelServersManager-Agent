import winston from 'winston';
import 'winston-daily-rotate-file';

export const LOG_DIRECTORY = (process.cwd() || __dirname) + '/logs';

const transport = new winston.transports.DailyRotateFile({
  level: 'info',
  filename: 'agent-%DATE%.log',
  datePattern: 'YYYY-MM-DD_HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  dirname: LOG_DIRECTORY
});

const logger = winston.createLogger({
      level: process.env.NODE_ENV === "development" ? "debug" : "info",
    format: winston.format.combine(
      winston.format.timestamp(), // adds a timestamp property
      winston.format.json()
    ),
    transports: [new winston.transports.Console(), transport],
  },
)

export default logger;
