import Fastify from 'fastify';

import ajvConfig from './ajv-config';
import jsonSchemas from './plugins/json-shemas';
import shutdownHandlers from './plugins/shutdown-handlers';

export async function init() {
  const fastify = Fastify({
    logger: true,
    ajv: ajvConfig,
  });

  await fastify
    .register(shutdownHandlers)
    .register(jsonSchemas);

  fastify.get('/', () => {
    return { hello: 'world' };
  });

  return fastify;
}
