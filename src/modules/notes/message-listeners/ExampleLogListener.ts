import logger from '#logger';
import { BaseMessageListener, RedisMessage } from '#message-bus';
import { NoteMessageListenerType, NoteMessageType } from '#modules/notes/enums';
import { NoteStatusChangedMessage } from '#modules/notes/messages';

export class ExampleLogListener
  extends BaseMessageListener<NoteStatusChangedMessage> {
  protected readonly haveSensitiveData = false;

  public constructor(consumerName?: string) {
    super({
      streamName: NoteMessageType.noteStatusChanged,
      groupName: NoteMessageListenerType.exampleLog,
      consumerName,
    });
  }

  protected async handler({ payload }: RedisMessage<NoteStatusChangedMessage>) {
    logger.info(
      {
        noteId: payload.id,
        previousStatus: payload.previousStatus,
        newStatus: payload.newStatus,
      },
      `Log from ${this.constructor.name}`,
    );
  }
}
