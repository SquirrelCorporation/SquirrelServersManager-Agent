import winston from 'winston';
import { LOGS_PATH } from './config';
import 'winston-daily-rotate-file';


const transport = new winston.transports.DailyRotateFile({
  level: 'info',
  filename: 'agent-%DATE%.log',
  datePattern: 'YYYY-MM-DD_HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  dirname: LOGS_PATH
});

const logger = winston.createLogger({
     level: process.env.NODE_ENV === "development" || process.env.DEBUG ? "debug" : "info",
    format: winston.format.combine(
      winston.format.timestamp(), // adds a timestamp property
      winston.format.json()
    ),
    transports: [new winston.transports.Console(), transport],
  },
)

export default logger;
