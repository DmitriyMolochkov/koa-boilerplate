import { serverConfig } from '#config';
import { ParsedRedisMessage, RedisStreamService } from '#redis';
import { wait } from '#utils';

import { BaseMessage } from './BaseMessage';
import {
  IAcknowledgeMessagesParams,
  IGetMessageGeneratorParams,
  IGetStalledMessageGenerator,
  IInitializeConsumerGroupParams,
  IResetTimeUntilReHandle,
} from './interfaces';

class MessageBus {
  private redisKeyPrefix: string;

  constructor(redisKeyPrefix: string) {
    this.redisKeyPrefix = `${redisKeyPrefix}:message-bus`;
  }

  private getStreamName(streamName: string) {
    return [this.redisKeyPrefix, streamName].join(':');
  }

  public async addMessage<Msg extends BaseMessage>(message: Msg) {
    const result = await RedisStreamService.addToStream({
      streamName: this.getStreamName(message.streamName),
      objectToStore: {
        version: message.version,
        payload: message.payload,
        createDateTime: message.createDateTime,
      },
    });

    return result;
  }

  public async initializeConsumerGroup<Msg extends BaseMessage>({
    streamName,
    groupName,
    startId,
  }: IInitializeConsumerGroupParams<Msg>) {
    const result = await RedisStreamService.initializeConsumerGroup({
      streamName: this.getStreamName(streamName),
      groupName,
      startId,
    });

    return result;
  }

  public async acknowledgeMessages<Msg extends BaseMessage>({
    streamName,
    groupName,
    messageIds,
  }: IAcknowledgeMessagesParams<Msg>) {
    const result = await RedisStreamService.acknowledgeMessages({
      streamName: this.getStreamName(streamName),
      groupName,
      messageIds,
    });

    return result;
  }

  private async* baseGenerator(
    getMessagesFn: () => Promise<ParsedRedisMessage[]>,
    abortSignal: AbortSignal,
  ) {
    const abortPromise = new Promise<AbortSignal>((resolve) => {
      abortSignal.addEventListener('abort', () => resolve(abortSignal), { once: true });
    });

    while (!abortSignal.aborted) {
      // eslint-disable-next-line no-await-in-loop
      const result = await Promise.race([
        getMessagesFn(),
        abortPromise,
      ]);

      if (result instanceof AbortSignal) {
        return;
      }

      type Message = [string, { version: string; payload: string; createDateTime: string }];

      for (const [messageId, { version, payload, createDateTime }] of result as Message[]) {
        yield {
          messageId,
          version,
          rawPayload: payload,
          createDateTimeStr: createDateTime,
        };
      }
    }
  }

  public getMessageGenerator<Msg extends BaseMessage>({
    redisConnection,
    streamName,
    groupName,
    consumerName,
    abortSignal,
  }: IGetMessageGeneratorParams<Msg>) {
    const getMessagesFn = async () => {
      const streamResults = await RedisStreamService.readConsumerGroup({
        redisConnection,
        streamName: this.getStreamName(streamName),
        groupName,
        consumerName,
        blockMs: 0,
        count: 1,
      });

      const [streamResult] = streamResults;

      if (!streamResult) {
        throw new Error('Impossible exception: streamResult is undefined');
      }

      const [, messages] = streamResult;

      return messages;
    };

    return this.baseGenerator(getMessagesFn, abortSignal);
  }

  public getStalledMessageGenerator<Msg extends BaseMessage>({
    redisConnection,
    streamName,
    groupName,
    consumerName,
    abortSignal,
    minIdleTimeMs,
  }: IGetStalledMessageGenerator<Msg>) {
    const getMessagesFn = async () => {
      const streamResult = await RedisStreamService.autoClaimMessages({
        redisConnection,
        streamName: this.getStreamName(streamName),
        groupName,
        consumerName,
        minIdleTimeMs,
        count: 1,
      });

      const [, messages] = streamResult;

      if (messages.length === 0) {
        await wait(5000); // 5 seconds
      }

      return messages;
    };

    return this.baseGenerator(getMessagesFn, abortSignal);
  }

  public async resetTimeUntilReHandle<Msg extends BaseMessage>({
    redisConnection,
    streamName,
    groupName,
    consumerName,
    messageIds,
  }: IResetTimeUntilReHandle<Msg>) {
    const result = await RedisStreamService.claimMessages({
      redisConnection,
      streamName: this.getStreamName(streamName),
      groupName,
      consumerName,
      minIdleTimeMs: 0,
      messageIds,
      justId: true,
    });

    return result;
  }
}

export default new MessageBus(serverConfig.domain);
