import Redis from 'ioredis';

export interface IAddToStreamParams {
  streamName: string;
  objectToStore: Record<string | symbol, unknown>;
}

export interface IInitializeConsumerGroupParams {
  streamName: string;
  groupName: string;
  startId: string | number;
}

export interface IReadConsumerGroupParams {
  redisConnection: Redis;
  streamName: string;
  groupName: string;
  consumerName: string;
  blockMs: number;
  count: number;
}

export interface IAcknowledgeMessagesParams {
  streamName: string;
  groupName: string;
  messageIds: string[];
}

export interface IAutoClaimMessage {
  redisConnection: Redis;
  streamName: string;
  groupName: string;
  consumerName: string;
  minIdleTimeMs: number;
  count: number;
}

export interface IClaimMessage<JustId extends boolean> {
  redisConnection: Redis;
  streamName: string;
  groupName: string;
  consumerName: string;
  minIdleTimeMs: number;
  messageIds: string[];
  justId: JustId;
}
