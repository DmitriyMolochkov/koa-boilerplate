import logger from '#logger';

import {
  IAcknowledgeMessagesParams,
  IAddToStreamParams,
  IAutoClaimMessage,
  IClaimMessage,
  IInitializeConsumerGroupParams,
  IReadConsumerGroupParams,
} from './interfaces';
import redis from '../redis';
import { StreamRawRedisMessage } from '../types';
import { encodeMessage, parseStreamMessage } from '../utils';

export async function addToStream({
  streamName,
  objectToStore,
}: IAddToStreamParams) {
  const messageObject = encodeMessage(objectToStore);

  const result = await redis.xadd(
    streamName,
    '*',
    ...Object.entries(messageObject).flat(),
  );

  return result;
}

export async function initializeConsumerGroup({
  streamName,
  groupName,
  startId,
}: IInitializeConsumerGroupParams) {
  try {
    const result = await redis.xgroup(
      'CREATE',
      streamName,
      groupName,
      startId,
      'MKSTREAM',
    );

    logger.info(
      {
        streamName,
        groupName,
        startId,
      },
      'The Redis stream consumer group has been created',
    );

    return result;
  } catch (error) {
    if (error instanceof Error && error.message.includes('BUSYGROUP')) {
      // Consumer group already exists
      return undefined;
    }

    throw error;
  }
}

export async function readConsumerGroup({
  redisConnection,
  streamName,
  groupName,
  consumerName,
  blockMs,
  count,
}: IReadConsumerGroupParams) {
  const streamMessages = await redisConnection.xreadgroup(
    'GROUP',
    groupName,
    consumerName,
    'COUNT',
    count,
    'BLOCK',
    blockMs,
    'STREAMS',
    streamName,
    '>',
  ) as StreamRawRedisMessage[];

  return streamMessages.map(parseStreamMessage);
}

export async function acknowledgeMessages({
  streamName,
  groupName,
  messageIds,
}: IAcknowledgeMessagesParams) {
  const result = await redis.xack(streamName, groupName, ...messageIds);

  return result;
}

export async function autoClaimMessages({
  redisConnection,
  streamName,
  groupName,
  consumerName,
  minIdleTimeMs,
  count,
}: IAutoClaimMessage) {
  const rawMessage = await redisConnection.xautoclaim(
    streamName,
    groupName,
    consumerName,
    minIdleTimeMs,
    '0-0',
    'COUNT',
    count,
  ) as StreamRawRedisMessage;

  return parseStreamMessage(rawMessage);
}

type ReturnClaimMessagesData<JustId extends boolean> = JustId extends true
  ? string[]
  : StreamRawRedisMessage;

export async function claimMessages<JustId extends boolean>({
  redisConnection,
  streamName,
  groupName,
  consumerName,
  minIdleTimeMs,
  messageIds,
  justId,
}: IClaimMessage<JustId>): Promise<(ReturnClaimMessagesData<JustId>)> {
  const additionalArgs = [];

  if (justId) {
    additionalArgs.push('JUSTID');
  }

  const rawMessage = await redisConnection.xclaim(
    streamName,
    groupName,
    consumerName,
    minIdleTimeMs,
    ...messageIds,
    ...additionalArgs,
  );

  if (justId) {
    return rawMessage as ReturnClaimMessagesData<JustId>;
  }

  return parseStreamMessage(
    rawMessage as StreamRawRedisMessage,
  ) as unknown as ReturnClaimMessagesData<JustId>;
}
