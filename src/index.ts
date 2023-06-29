import 'reflect-metadata';

import { serverConfig } from '#config';

import { init } from './server';
import A from './test';

const start = async () => {
  try {
    A();
    const server = await init();
    await server.listen({ port: serverConfig.port });
  } catch (err) {
    console.error('Error While Starting the Server', err);
  }
};

await start();
