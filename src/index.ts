import 'reflect-metadata';

import { serverConfig } from '#config';
import logger from '#logger';

import { init } from './server';
import A from './test';

const start = async () => {
  try {
    A();
    const server = await init();
    await server.listen({ port: serverConfig.port });
  } catch (err) {
    logger.error(err, 'Error while starting the server');
  }
};

await start();
