import sendDeviceInfoToApi from "../api/device.info";
import logger from "../logger";

let numAttempt = 0

const agentLoop = async (hostId: string) => {
    logger.info(`[AGENT] [LOOP] - Sending info to master node...`);
    if (numAttempt !== 0) logger.info('[AGENT] Loop - Attempt #:' + numAttempt);
    try {
      await sendDeviceInfoToApi(hostId);
      numAttempt = 0;
    } catch (error: any) {
      logger.error(error)
        numAttempt++
    }
     setTimeout(() => {
      agentLoop(hostId);
    }, 30000);
}
export default agentLoop;
