import Redis from 'ioredis';

import { BaseMessage } from './BaseMessage';

export interface IInitializeConsumerGroupParams<Msg extends BaseMessage> {
  streamName: Msg['streamName'];
  groupName: string;
  startId: string | number;
}

export interface IAcknowledgeMessagesParams<Msg extends BaseMessage> {
  streamName: Msg['streamName'];
  groupName: string;
  messageIds: string[];
}

export interface IGetMessageGeneratorParams<Msg extends BaseMessage> {
  redisConnection: Redis;
  streamName: Msg['streamName'];
  groupName: string;
  consumerName: string;
  abortSignal: AbortSignal;
}

export interface IGetStalledMessageGenerator<Msg extends BaseMessage> {
  redisConnection: Redis;
  streamName: Msg['streamName'];
  groupName: string;
  consumerName: string;
  minIdleTimeMs: number;
  abortSignal: AbortSignal;
}

export interface IResetTimeUntilReHandle<Msg extends BaseMessage> {
  redisConnection: Redis;
  streamName: Msg['streamName'];
  groupName: string;
  consumerName: string;
  messageIds: string[];
}
