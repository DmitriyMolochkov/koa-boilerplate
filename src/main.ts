import { serverConfig } from '#config';
import { DataSource } from '#database';
import jobQueue from '#job-queue';
import logger from '#logger';
import { jobQueueManager } from '#managers';
import redis from '#redis';

import { init } from './server';
import onShutdown from './server/on-shutdown';

export default async function start() {
  try {
    if (!DataSource.isInitialized) {
      throw new Error('Database not initialized');
    }

    if (redis.status !== 'ready') {
      throw new Error('Redis is not ready');
    }

    await jobQueueManager.init();
    jobQueue.start()
      .catch((error) => {
        logger.error(error, 'Error in job queue');
        process.exit(-1);
      });

    const koa = await init();
    const server = koa.listen(
      {
        port: serverConfig.port,
      },
      async () => {
        logger.info(`Server listening on port: ${serverConfig.port}`);
        onShutdown(server);
      },
    );
  } catch (error) {
    logger.error(error, 'Error while starting the server');
    process.exitCode = 1;
  }
}
