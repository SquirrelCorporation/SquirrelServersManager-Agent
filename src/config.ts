import dotenv from 'dotenv';
dotenv.config();  // Load environment variables from .env file

export const URL_MASTER = process.env.API_URL_MASTER;
export const EVERY = parseInt(process.env.API_EVERY || '10');
