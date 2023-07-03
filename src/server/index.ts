import Fastify from 'fastify';

import logger from '#logger';

import ajvConfig from './ajv-config';
import { shutdownHandlers } from './plugins';

export async function init() {
  const fastify = Fastify({
    logger,
    ajv: ajvConfig,
  });

  await fastify
    .register(shutdownHandlers);

  fastify.get('/', () => {
    return { hello: 'world' };
  });

  return fastify;
}
