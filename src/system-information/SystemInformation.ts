import cron from 'node-cron';
import sendDeviceInfoToApi from '../api/device.info';
import {  STATISTICS_CRON_EXPRESSION } from '../config';
import logger from '../logger';
import getDeviceInfo from '../utils/os.informations';


// The delay before starting the watcher when the app is started
const START_WATCHER_DELAY_MS = 1000;
// Debounce delay used when performing a watch after a docker event has been received
const DEBOUNCED_WATCH_CRON_MS = 5000;

export default class SystemInformation {
  public hostId: string;
  public watchCron: any;
  public watchCronTimeout: any;
  public watchCronDebounced: any;


  constructor(hostId: string) {
    this.hostId = hostId;
    this.init();
  }

  /**
   * Init the Watcher.
   */
  async init() {
    logger.info(`Cron scheduled (${STATISTICS_CRON_EXPRESSION})`);
    this.watchCron = cron.schedule(STATISTICS_CRON_EXPRESSION, () => this.watchFromCron());

    // watch at startup (after all components have been registered)
    this.watchCronTimeout = setTimeout(() => this.watchFromCron(), START_WATCHER_DELAY_MS);
  }

  /**
   * Watch containers (called by cron scheduled tasks).
   * @returns {Promise<*[]>}
   */
  async watchFromCron() {
    logger.info(`Cron started (${STATISTICS_CRON_EXPRESSION})`);
    await getDeviceInfo(this.hostId).then(async (deviceInfo) => {
      logger.debug(deviceInfo);
      await sendDeviceInfoToApi(this.hostId, deviceInfo);
    });
  }
}
