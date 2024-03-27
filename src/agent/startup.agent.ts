import cron from 'node-cron';
import { STATISTICS_CRON_EXPRESSION, URL_MASTER } from '../config';
import pingApi from "../api/ping";
import retrieveOrRegisterDevice from "../api/register.device";
import agentLoop from "./loop.agent";
import logger, { LOG_DIRECTORY } from '../logger';

const startAgent = async () => {
  logger.info(`#############################################`);
  logger.info(`###### SQUIRREL SERVERS MANAGER AGENT #######`);
  logger.info(`#############################################`);
  logger.info(`[AGENT] startAgent - Logs in ${LOG_DIRECTORY}`);
  if (!cron.validate(STATISTICS_CRON_EXPRESSION)) {
    logger.error("[AGENT] startAgent - Cron expression invalid");
    throw new Error("[AGENT] startAgent - Cron expression invalid");
  }
  if (!URL_MASTER) {
    logger.error("[AGENT] startAgent - No URL_MASTER env");
    throw new Error("[AGENT] startAgent - NO URL_MASTER env");
  }
  // PING API
  await pingApi();
  // REGISTER OR RETRIEVE "HOST ID"
  const hostId = await retrieveOrRegisterDevice();

  logger.info(`[AGENT] startAgent ----> Host id is ${hostId}`);
  if (hostId) {
    logger.info(`[AGENT] startAgent -----> Starting Agent Loop`);
    agentLoop(hostId);
  } else {
    throw new Error("Internal error, hostid not set")
  }
}

export default startAgent;
