import dotenv from 'dotenv';
dotenv.config();  // Load environment variables from .env file

export const URL_MASTER = process.env.API_URL_MASTER;
export const STATISTICS_CRON_EXPRESSION = process.env.API_EVERY || '*/30 * * * * *';
