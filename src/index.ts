import 'reflect-metadata';

import { serverConfig } from '#config';
import logger from '#logger';

import { init } from './server';
import onShutdown from './server/on-shutdown';
import A from './test';

console.log(process.pid);

const start = async () => {
  try {
    A();
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
  } catch (err) {
    logger.error(err, 'Error while starting the server');
  }
};

await start();
