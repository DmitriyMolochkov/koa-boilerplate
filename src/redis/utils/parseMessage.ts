import { keyValuePairs } from './keyValuePairs';
import { ParsedRedisMessage, RawRedisMessage } from '../types';

export function parseMessage([id, redisValues]: RawRedisMessage) {
  const record = Object.fromEntries(keyValuePairs(redisValues)) as Record<string, string>;

  return [id, record] as ParsedRedisMessage;
}
