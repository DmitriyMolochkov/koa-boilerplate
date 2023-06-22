import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import { constructorToJsonSchema, getMetadataStorage } from '#class-validator';

const registerJsonSchemas: FastifyPluginAsync = async (server) => {
  Array.from(getMetadataStorage().validationMetadatas.keys())
    .forEach((target) => {
      if (typeof target === 'string') {
        return;
      }

      server.addSchema(constructorToJsonSchema(target));
    });
};

export default fp(registerJsonSchemas);
