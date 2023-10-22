import Redis from 'ioredis';

import { redisConfig } from '#config';
import logger from '#logger';

import onEvents from './on-events';

const redis = new Redis({
  port: redisConfig.port,
  host: redisConfig.host,
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

onEvents(redis);

async function connect() {
  try {
    await redis.connect();
  } catch (error) {
    redis.disconnect();
    logger.error(error, 'Error while connecting to redis');
  }
}

await connect();

export default redis;
