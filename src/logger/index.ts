import pino from 'pino';

import config from '#config';
import { Environment } from '#constants';

const pinoConfigsObj: Record<Environment, pino.LoggerOptions> = {
  development: {
    transport: {
      target: 'pino-pretty',
    },
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  production: {},
};

const pinoConfig = pinoConfigsObj[config.nodeEnv];

const logger = pino(pinoConfig);

export default logger;

export * from './decocators';
export * from './constants';
