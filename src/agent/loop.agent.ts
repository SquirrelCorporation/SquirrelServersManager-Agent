import cron from 'node-cron';
import sendDeviceInfoToApi from "../api/device.info";
import logger from "../logger";
import { STATISTICS_CRON_EXPRESSION } from '../config';
let numAttempt = 0

const agentLoop = async (hostId: string) => {
  const task = cron.schedule(STATISTICS_CRON_EXPRESSION, async () => {
    logger.info(`[AGENT] [LOOP] - Sending info to master node...`);
    if (numAttempt !== 0) logger.info('[AGENT] Loop - Attempt #:' + numAttempt);
    try {
      await sendDeviceInfoToApi(hostId);
      numAttempt = 0;
    } catch (error: any) {
      logger.error(error)
      numAttempt++
    }
  });
  task.start();
}
export default agentLoop;
