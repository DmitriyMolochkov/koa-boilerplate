import ajvErrors from 'ajv-errors';
import ajvFormats from 'ajv-formats';
import ajvKeywords from 'ajv-keywords';
import Fastify from 'fastify';

import config from '#config';

import A from './test';

const fastify = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      allErrors: true,
      strict: true,
      coerceTypes: false,
      removeAdditional: false,
      verbose: true,
    },
    plugins: [
      ajvErrors,
      ajvKeywords,
      ajvFormats,
    ],
  },
});

fastify.get('/', () => {
  console.log();
  return { hello: 'world' };
});

/**
 * Run the server!
 */
const start = async() => {
  try {
    A();
    await fastify.listen({ port: config.port });
  } catch (err) {
    fastify.log.error(err);
  }
};

await start();
