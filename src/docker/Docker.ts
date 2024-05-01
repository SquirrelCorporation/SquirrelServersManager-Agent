import Dockerode, { ContainerInfo } from 'dockerode';
import cron from 'node-cron';
import fs from 'node:fs';
import sendContainerInfoToApi from '../api/containers.info';
import { DOCKER_CRON_EXPRESSION, DOCKER_SOCKET } from '../config';
import logger from '../logger';
import debounce = require('debounce');


// The delay before starting the watcher when the app is started
const START_WATCHER_DELAY_MS = 1000;
// Debounce delay used when performing a watch after a docker event has been received
const DEBOUNCED_WATCH_CRON_MS = 5000;

export default class Docker {
  public hostId: string;
  public watchCron: any;
  public watchCronTimeout: any;
  public watchCronDebounced: any;
  public listenDockerEventsTimeout: any;
  public dockerApi: Dockerode;

  constructor(hostId: string) {
    this.hostId = hostId;
    const options: Dockerode.DockerOptions = {socketPath: DOCKER_SOCKET};
    this.dockerApi = new Dockerode(options);
    this.init();
  }

  /**
   * Init the Watcher.
   */
  async init() {
    try {
      logger.info(`[AGENT] - Cron Docker scheduled (${DOCKER_CRON_EXPRESSION})`);
      this.watchCron = cron.schedule(DOCKER_CRON_EXPRESSION, () => this.watchFromCron());

      // watch at startup (after all components have been registered)
      this.watchCronTimeout = setTimeout(() => this.watchFromCron(), START_WATCHER_DELAY_MS);

      // listen to docker events
      this.watchCronDebounced = debounce(() => {
        this.watchFromCron();
      }, DEBOUNCED_WATCH_CRON_MS);
      this.listenDockerEventsTimeout = setTimeout(
        () => this.listenDockerEvents(),
        START_WATCHER_DELAY_MS,
      );
    } catch (e: any) {
      logger.error(e);
    }
  }

  /**
   * Listen and react to docker events.
   * @return {Promise<void>}
   */
  async listenDockerEvents() {
    try {
      logger.info('Listening to docker events');
      const options: {
        filters: {
          type?:
            | Array<
            | 'container'
            | 'image'
            | 'volume'
            | 'network'
            | 'daemon'
            | 'plugin'
            | 'service'
            | 'node'
            | 'secret'
            | 'config'
          >
            | undefined;
          event: string[] | undefined;
        };
      } = {
        filters: {
          type: ['container'],
          event: ['create', 'destroy', 'start', 'stop', 'pause', 'unpause', 'die', 'update'],
        },
      };
      this.dockerApi.getEvents(options, (err: any, stream: any) => {
        if (err) {
          logger.warn(`[AGENT] - Unable to listen to Docker events [${err.message}]`);
          logger.debug(err);
        } else {
          stream?.on('data', (chunk: any) => this.onDockerEvent(chunk));
        }
      });
    } catch (e: any) {
      logger.warn(`[AGENT] - Unable to listen to Docker events [${e.message}]`);
    }
  }

  /**
   * Process a docker event.
   * @param dockerEventChunk
   * @return {Promise<void>}
   */
  async onDockerEvent(dockerEventChunk: any) {
    logger.info('onDockerEvent');
    const dockerEvent = JSON.parse(dockerEventChunk.toString());
    const action = dockerEvent.Action;
    const containerId = dockerEvent.id;
    logger.info('[AGENT] - Docker - onDockerEvent - action: ' + action);

    // If the container was created or destroyed => perform a watch
    if (action === 'destroy' || action === 'create') {
      await this.watchCronDebounced();
    } else {
      // Update container state in db if so
      try {
        const container = this.dockerApi.getContainer(containerId);
        const containerInspect = await container.inspect();
        const newStatus = containerInspect.State.Status;
        //TODO: send to API
        /*
        const containerFound = await ContainerRepo.findContainerById(containerId);
        if (containerFound) {
          logger.error(JSON.stringify(containerInspect));
          // Child logger for the container to process
          const oldStatus = containerFound.status;
          containerFound.status = newStatus;
          if (oldStatus !== newStatus) {
            await ContainerRepo.updateContainer(containerFound);
            this.childLogger.info(
              `[DOCKER][${fullName(containerFound)}] Status changed from ${oldStatus} to ${newStatus}`,
            );
          }
        }*/
      } catch (e) {
        logger.debug(`[AGENT] - Docker - Unable to get container details for container id=[${containerId}]`);
      }
    }
  }

  /**
   * Watch containers (called by cron scheduled tasks).
   * @returns {Promise<*[]>}
   */
  async watchFromCron() {
    logger.info(`[AGENT] - Docker - Cron started (${DOCKER_CRON_EXPRESSION})`);

    // Get container reports
    const containerReports = await this.watch();
    try {
      await sendContainerInfoToApi(this.hostId, containerReports);
    } catch (error: any){
      logger.error(`[AGENT] - Docker - Error sending to api ${error.message}`);
    }
    // Count container reports
    const containerReportsCount = containerReports.length;

    const stats = `${containerReportsCount} containers watched`;
    logger.info(`[AGENT] - Docker - Cron finished (${stats})`);
    return containerReports;
  }

  /**
   * Watch main method.
   * @returns {Promise<*[]>}
   */
  async watch() {
    let containers: any[] = [];
    // List images to watch
    try {
      const listContainersOptions = { all: true };
      logger.info('[AGENT] - Docker - getContainers - dockerApi.listContainers');
      containers = await this.dockerApi.listContainers(listContainersOptions);
      logger.info(`[AGENT] - Docker - getContainers - Got ${containers?.length}`);
    } catch (e: any) {
      logger.error(e);
      logger.warn(
        `[AGENT] - Docker - Error when trying to get the list of the containers to watch (${e.message})`,
      );
    }
    try {
      //EventHandler.emitContainerReports(containerReports);
      const containersResult = await Promise.all(containers.map(async (container: ContainerInfo) => {
        return {
          container: container,
        }
      }));
      logger.info(`[AGENT] - Docker - getContainers - Returned`);
      return containersResult;
    } catch (e: any) {
      logger.error(e);
      logger.warn(`[AGENT] - Docker - Error when processing some containers (${e.message})`);
      return [];
    }
  }
}
