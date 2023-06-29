import Fastify from 'fastify';

import logger from '#logger';

import ajvConfig from './ajv-config';
import { jsonSchemas, shutdownHandlers } from './plugins';

export async function init() {
  const fastify = Fastify({
    logger,
    ajv: ajvConfig,
  });

  await fastify
    .register(jsonSchemas)
    .register(shutdownHandlers);

  fastify.get('/', () => {
    return { hello: 'world' };
  });

  return fastify;
}
