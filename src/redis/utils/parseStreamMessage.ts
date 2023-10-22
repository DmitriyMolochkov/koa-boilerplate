import { parseMessage } from './parseMessage';
import { StreamRawRedisMessage, StreamRedisMessage } from '../types';

export function parseStreamMessage([streamKey, rawMessages]: StreamRawRedisMessage) {
  const messages = rawMessages.map(parseMessage);

  return [streamKey, messages] as StreamRedisMessage;
}
