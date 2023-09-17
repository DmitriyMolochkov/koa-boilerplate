import Redis from 'ioredis';

import logger from '#logger';

export default function onEvents(redis: Redis) {
  redis.on('error', (error) => logger.error(error, 'Redis failed to connect'));
  redis.on('connect', () => logger.info('Connected to redis'));
  redis.on('reconnecting', (ms: number) => {
    logger.error(`Reconnecting to redis in ${ms}`);
  });
  redis.on('close', () => logger.error('Connection to redis has closed'));
  redis.on('end', () => {
    logger.error('Connection to redis has closed and no more reconnects will be done');
  });
}
