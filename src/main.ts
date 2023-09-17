import { serverConfig } from '#config';
import { DataSource } from '#database';
import logger from '#logger';

import { init } from './server';
import onShutdown from './server/on-shutdown';

export default async function start() {
  try {
    if (!DataSource.isInitialized) {
      throw new Error('Database not initialized');
    }

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
