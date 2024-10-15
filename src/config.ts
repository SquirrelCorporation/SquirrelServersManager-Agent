import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

export const URL_MASTER = process.env.API_URL_MASTER || process.env.URL_MASTER;
export const AGENT_HEALTH_CRON_EXPRESSION = process.env.AGENT_HEALTH_EVERY || '*/30 * * * * *';
export const STATISTICS_CRON_EXPRESSION = process.env.API_EVERY || '*/30 * * * * *';
export const OVERRIDE_IP_DETECTION = process.env.OVERRIDE_IP_DETECTION || 'AGENT_DETECTION';
export const HOST_ID_PATH = process.env.HOST_ID_PATH || '/data/';
export const LOGS_PATH = process.env.LOGS_PATH || '/data/logs';
export const HOST_ID = process.env.HOST_ID;