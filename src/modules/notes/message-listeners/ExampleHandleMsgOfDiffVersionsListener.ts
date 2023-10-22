import logger from '#logger';
import { BaseMessageListener, RedisMessage } from '#message-bus';
import { NoteMessageListenerType, NoteMessageType } from '#modules/notes/enums';
import { NoteExpiredMessage } from '#modules/notes/messages';

export class ExampleHandleMsgOfDiffVersionsListener
  extends BaseMessageListener<NoteExpiredMessage> {
  protected readonly haveSensitiveData = false;

  public constructor(consumerName?: string) {
    super({
      streamName: NoteMessageType.noteExpired,
      groupName: NoteMessageListenerType.exampleHandleMsgOfDiffVersions,
      consumerName,
    });
  }

  protected handlerByVersion: {
    [key in RedisMessage<NoteExpiredMessage>['version']]:
    (message: RedisMessage<NoteExpiredMessage<key>>) => Promise<void>
  } = {
      v1: async ({
        id, version, payload, createDateTime,
      }) => {
        logger.info(
          {
            messageMetadata: {
              id,
              version,
              createDateTime,
            },
            id: payload.id,
          },
          'Example v1 NoteExpiredMessage: Note was expired!',
        );
      },
      v2: async ({
        id, version, payload, createDateTime,
      }) => {
        logger.info(
          {
            messageMetadata: {
              id,
              version,
              createDateTime,
            },
            id: payload.id,
            description: payload.description,
          },
          'Example v2 NoteExpiredMessage: Note was expired!',
        );
      },
    };

  protected errorHandlerByVersion: {
    [key in NoteExpiredMessage['version']]?:
    (message: RedisMessage<NoteExpiredMessage<key>>, error: unknown) => Promise<void>
  } = {
      v2: async (message, error) => {
        logger.info(error, 'Example error handler for v2 NoteExpiredMessage');
      },
    };

  protected async handler(message: RedisMessage<NoteExpiredMessage>) {
    const handlerByVersion = this.handlerByVersion[message.version] as
      (msg: RedisMessage<NoteExpiredMessage>) => Promise<void>;
    const result = await handlerByVersion(message);

    return result;
  }

  protected async errorHandler(message: RedisMessage<NoteExpiredMessage>, error: unknown) {
    const errorHandlerByVersion = this.errorHandlerByVersion[message.version] as
      ((msg: RedisMessage<NoteExpiredMessage>, error: unknown) => Promise<void>) | undefined;

    if (errorHandlerByVersion) {
      await errorHandlerByVersion(message, error);
    }
  }
}
