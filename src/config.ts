import dotenv from 'dotenv';
dotenv.config();  // Load environment variables from .env file

export const URL_MASTER = process.env.API_URL_MASTER;
export const AGENT_HEALTH_CRON_EXPRESSION = process.env.AGENT_HEALTH_EVERY || '*/30 * * * * *';
export const STATISTICS_CRON_EXPRESSION = process.env.API_EVERY || '*/30 * * * * *';
export const DOCKER_SOCKET = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
export const OVERRIDE_IP_DETECTION = process.env.OVERRIDE_IP_DETECTION || 'AGENT_DETECTION';
