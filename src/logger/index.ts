import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
