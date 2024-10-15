import axios from 'axios';
import { URL_MASTER } from '../config';
import logger from '../logger';

const logHeaders = (headers: any) => {
    logger.debug('[AGENT] sendDeviceInfoToApi - Response Headers:');
    for (const [key, value] of Object.entries(headers)) {
        logger.debug(`Header:   ${key}: ${value}`);
    }
};
const sendDeviceInfoToApi = async (hostId: string, deviceInfo: any) => {
    logger.info(`[AGENT] sendDeviceInfoToApi - To -> ${URL_MASTER}/api/devices/${hostId}`);

    await axios.post(`${URL_MASTER}/api/devices/${hostId}`, deviceInfo)
      .then(async response => {
        logger.info("[AGENT] sendDeviceInfoToApi - Success");
        logger.debug(response.data);
      })
      .catch((error) => {
          logger.error(error.message);
          logger.debug(error);
          logHeaders(error.response.headers);
          if (error?.response?.status === 404) {
              throw new Error(`[AGENT] sendDeviceInfoToApi - Trying to send device info without registering first try to delete the hostid.txt file first`);
          }
          throw new Error(`[AGENT] sendDeviceInfoToApi - Master node connection failed`);
      });
}

export default sendDeviceInfoToApi;

