import logger from '#logger';
import redis from '#redis';
import { errorToObject } from '#utils';

import { BaseMessage } from './BaseMessage';
import messageBus from './message-bus';
import { RedisMessage } from './RedisMessage';

export abstract class BaseMessageListener<Msg extends BaseMessage, ReturnData = void> {
  private readonly readableConnection = redis.duplicate();
  private readonly stalledReadableConnection = redis.duplicate();

  private abortController: AbortController;
  private processPromise: Promise<unknown> = Promise.resolve();

  protected readonly streamName: Msg['streamName'];
  protected readonly groupName: string;
  protected readonly consumerName: string;
  protected readonly timeUntilReHandle: number = 15_000; // 15 seconds
  protected readonly initialMessageReadingDate: Date | 0 | '$'; // strictly >, 0 - from the beginning, $ - current time
  protected abstract readonly haveSensitiveData: boolean;

  protected abstract handler(message: RedisMessage<Msg>): Promise<ReturnData>;
  protected errorHandler?(message: RedisMessage<Msg>, error: unknown): Promise<void>;
  protected completeHandler?(result: ReturnData): Promise<void>;

  private get abortSignal() {
    return this.abortController.signal;
  }

  private get commonLogFields() {
    return {
      listener: this.constructor.name,
      streamName: this.streamName,
      groupName: this.groupName,
      consumerName: this.consumerName,
    };
  }

  protected constructor({
    streamName,
    groupName,
    consumerName,
    initialMessageReadingDate,
  }: {
    streamName: Msg['streamName'];
    groupName: string;
    consumerName?: string;
    initialMessageReadingDate?: Date | 0 | '$';
  }) {
    this.streamName = streamName;
    this.groupName = groupName;
    this.abortController = new AbortController();
    this.consumerName = consumerName ?? 'default';
    this.initialMessageReadingDate = initialMessageReadingDate ?? 0;
  }

  protected hideContentIfNeeded<T>(content: T) {
    return this.haveSensitiveData ? '[HIDDEN]' : content;
  }

  private async runCompleteHandler(result: ReturnData, messageId: string, version: Msg['version']) {
    if (this.completeHandler) {
      try {
        await this.completeHandler(result);
      } catch (handlerError) {
        logger.error(
          {
            ...this.commonLogFields,
            messageId,
            version,
            result: this.hideContentIfNeeded(result),
            error: errorToObject(handlerError),
          },
          `${this.constructor.name}: Cannot run complete handler for handled message`,
        );
      }
    }
  }

  private async runErrorHandler(message: RedisMessage<Msg> | undefined, error: unknown) {
    if (this.errorHandler && message) {
      const { id: messageId, version, payload } = message;

      try {
        await this.errorHandler(message, error);
      } catch (handlerError) {
        logger.error(
          {
            ...this.commonLogFields,
            messageId,
            version,
            payload: this.hideContentIfNeeded(payload),
            error: errorToObject(handlerError),
          },
          `${this.constructor.name}: Cannot run error handler for job failure`,
        );
      }
    }
  }

  private async listener(messageConstrParams: ConstructorParameters<typeof RedisMessage>[0]) {
    let message: RedisMessage<Msg> | undefined;

    try {
      message = new RedisMessage<Msg>(messageConstrParams);
      const { id: messageId, version, payload } = message;

      logger.info(
        {
          ...this.commonLogFields,
          messageId,
          version,
          payload: this.hideContentIfNeeded(payload),
        },
        `${this.constructor.name}: Started message handler`,
      );

      const result = await this.handler(message);

      logger.info(
        {
          ...this.commonLogFields,
          messageId,
          version,
          payload: this.hideContentIfNeeded(payload),
          result: this.hideContentIfNeeded(result),
        },
        `${this.constructor.name}: Message handler completed`,
      );

      await this.runCompleteHandler(result, messageId, version);
    } catch (error) {
      const { messageId, version, rawPayload } = messageConstrParams;
      logger.error(
        {
          ...this.commonLogFields,
          messageId,
          version,
          payload: this.hideContentIfNeeded(message?.payload ?? rawPayload),
          error: errorToObject(error),
        },
        `${this.constructor.name}: Error while message handler`,
      );

      await this.runErrorHandler(message, error);
    }
  }

  private async handleRedisMessage(
    messageConstrParams: ConstructorParameters<typeof RedisMessage>[0],
  ) {
    await this.listener(messageConstrParams);

    await messageBus.acknowledgeMessages({
      streamName: this.streamName,
      groupName: this.groupName,
      messageIds: [messageConstrParams.messageId],
    });
  }

  private async readingRedisMessages() {
    const generator = messageBus.getMessageGenerator<Msg>({
      redisConnection: this.readableConnection,
      streamName: this.streamName,
      groupName: this.groupName,
      consumerName: this.consumerName,
      abortSignal: this.abortSignal,
    });

    for await (const message of generator) {
      await this.handleRedisMessage(message);
    }
  }

  private async readingStalledRedisMessages() {
    const generator = messageBus.getStalledMessageGenerator<Msg>({
      redisConnection: this.stalledReadableConnection,
      streamName: this.streamName,
      groupName: this.groupName,
      consumerName: this.consumerName,
      minIdleTimeMs: this.timeUntilReHandle,
      abortSignal: this.abortSignal,
    });

    for await (const message of generator) {
      const { messageId, version, rawPayload } = message;
      logger.warn(
        {
          ...this.commonLogFields,
          messageId,
          version,
          rawPayload: this.hideContentIfNeeded(rawPayload),
        },
        `${this.constructor.name}: Message stalled`,
      );
      await this.handleRedisMessage(message);
    }
  }

  protected async resetTimeUntilReHandle(messageId: string) {
    const result = await messageBus.resetTimeUntilReHandle<Msg>({
      redisConnection: this.stalledReadableConnection,
      streamName: this.streamName,
      groupName: this.groupName,
      consumerName: this.consumerName,
      messageIds: [messageId],
    });

    return result;
  }

  public async init() {
    await messageBus.initializeConsumerGroup({
      streamName: this.streamName,
      groupName: this.groupName,
      startId: this.initialMessageReadingDate instanceof Date
        ? this.initialMessageReadingDate.getTime()
        : this.initialMessageReadingDate.toString(),
    });
  }

  public async start() {
    if (this.abortSignal.aborted) {
      this.abortController = new AbortController();
    }

    const promises: Promise<void>[] = [
      this.readingRedisMessages(),
      this.readingStalledRedisMessages(),
    ];

    Promise.race(promises)
      .catch((error: unknown) => {
        if (!this.abortSignal.aborted) {
          this.abortController.abort();
        }

        logger.fatal(
          {
            ...this.commonLogFields,
            error: errorToObject(error),
          },
          `${this.constructor.name}: Fatal error`,
        );
      });

    this.processPromise = Promise.all(promises);

    return this.processPromise as Promise<void>;
  }

  public async stop() {
    this.abortController.abort();
    await this.processPromise; // wait for active handlers to complete
  }

  public async terminate() {
    await this.stop();
    this.readableConnection.disconnect();
    this.stalledReadableConnection.disconnect();
  }
}
