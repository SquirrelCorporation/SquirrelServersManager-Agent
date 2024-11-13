import axios from 'axios';
import fs from 'fs';
import osu from 'node-os-utils';
import { HOST_ID, HOST_ID_PATH, URL_MASTER } from '../config';
import logger from '../logger';

const HOST_ID_FULLPATH = `${HOST_ID_PATH}/hostid.txt`;

const retrieveOrRegisterDevice = async () => {
  if (HOST_ID) {
    fs.writeFile(HOST_ID_FULLPATH, HOST_ID, function(err) {
      if (err) throw err;
      logger.info('[AGENT] retrieveOrRegisterDevice - File is created successfully.');
    });
    return HOST_ID;
  }
  let hostId;
  if (!fs.existsSync(HOST_ID_FULLPATH)) {

      await axios.post(`${URL_MASTER}/api/devices`, { ip: osu.os.ip() })
        .then(async response => {
          logger.info(response.data);
          logger.info(`[AGENT] retrieveOrRegisterDevice - Registering id ${response.data.data.id}`);
          fs.writeFile(HOST_ID_FULLPATH, response.data.data.id, function(err) {
            if (err) throw err;
            logger.info('[AGENT] retrieveOrRegisterDevice - File is created successfully.');
          });
          hostId = response.data.data.id;
        })
        .catch(error => {
          logger.error(error);
          throw new Error(`[AGENT] retrieveOrRegisterDevice - Registering to Master node failed\n- Message: ${error.message}\n- Response: ${JSON.stringify(error.response.data)}`)
        });
} else {
      logger.info('[AGENT] retrieveOrRegisterDevice - Reading host id from file');
    let fileData = fs.readFileSync(HOST_ID_FULLPATH,
      {encoding: 'utf8', flag: 'r'});
    if (fileData) {
      hostId = fileData;
    }
  }
  return hostId;
}

export default retrieveOrRegisterDevice;
