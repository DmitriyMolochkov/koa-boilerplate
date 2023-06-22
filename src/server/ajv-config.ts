import ajvErrors from 'ajv-errors';
import ajvFormats from 'ajv-formats';
import ajvKeywords from 'ajv-keywords';
import { FastifyServerOptions } from 'fastify';

const ajvConfig: FastifyServerOptions['ajv'] = {
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
};

export default ajvConfig;
