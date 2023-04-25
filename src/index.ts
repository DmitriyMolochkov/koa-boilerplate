import Fastify from 'fastify';

import config from '#config';

import A from './test';

const fastify = Fastify({
  logger: true,
});

fastify.get('/', () => {
  console.log();
  return { hello: 'world' };
});

/**
 * Run the server!
 */
const start = async () => {
  try {
    A();
    await fastify.listen({ port: config.port });
  } catch (err) {
    fastify.log.error(err);
  }
};

await start();
