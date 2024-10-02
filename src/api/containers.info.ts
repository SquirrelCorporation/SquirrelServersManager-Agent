import axios from 'axios';
import { URL_MASTER } from '../config';
import logger from '../logger';

const sendContainerInfoToApi = async (hostId: string, containersResult: any) => {
  logger.info(`[AGENT] sendContainerInfoToApi - To -> ${URL_MASTER}/api/devices/containers/${hostId}`);
  logger.debug(JSON.stringify(containersResult));
  await axios.post(`${URL_MASTER}/api/devices/containers/${hostId}`, {containersResult: containersResult})
    .then(async response => {
      logger.info('[AGENT] sendDeviceInfoToApi - Success');
      logger.info(response.data);
    })
    .catch((error) => {
      logger.error(error.message);
      if (error?.response?.status === 404) {
        throw new Error(`[AGENT] sendContainerInfoToApi - Trying to send device info without registering first try to delete the hostid.txt file first`);
      }
      throw new Error(`[AGENT] sendContainerInfoToApi - Master node connection failed`);
    });
};

export default sendContainerInfoToApi;
