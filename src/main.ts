import { serverConfig } from '#config';
import { DataSource } from '#database';
import logger from '#logger';
import { jobQueueManager, messageListenerManager } from '#managers';
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

    await messageListenerManager.init();
    await jobQueueManager.init();

    messageListenerManager.start()
      .catch((error) => {
        logger.error(error, 'Error in message listener');
        process.exit(-1);
      });

    jobQueueManager.start()
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
    process.exit(1);
  }
}
