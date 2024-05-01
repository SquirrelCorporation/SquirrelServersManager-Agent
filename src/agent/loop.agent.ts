import cron from 'node-cron';
import logger from "../logger";
import { AGENT_HEALTH_CRON_EXPRESSION, STATISTICS_CRON_EXPRESSION } from '../config';

const agentLoop = async (hostId: string) => {
  const task = cron.schedule(AGENT_HEALTH_CRON_EXPRESSION, async () => {
    logger.info(`[AGENT] [LOOP] - Agent health for ${hostId}`);
  });
  task.start();
}
export default agentLoop;
