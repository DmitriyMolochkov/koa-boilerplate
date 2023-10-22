import logger from '#logger';
import { BaseMessageListener, RedisMessage } from '#message-bus';
import { NoteMessageListenerType, NoteMessageType } from '#modules/notes/enums';
import { addNoteExpireJob } from '#modules/notes/jobs/expire-note';
import { NoteCreatedMessage } from '#modules/notes/messages';
import * as NoteService from '#modules/notes/services';
import { isNoteNearExpiration } from '#modules/notes/utils';

export class AddExpireNoteJobsListener extends BaseMessageListener<NoteCreatedMessage> {
  protected readonly haveSensitiveData = false;

  public constructor(consumerName?: string) {
    super({
      streamName: NoteMessageType.noteCreated,
      groupName: NoteMessageListenerType.addExpireNoteJobs,
      consumerName,
    });
  }

  protected async handler({ payload }: RedisMessage<NoteCreatedMessage>) {
    const note = await NoteService.getById(payload.id);
    if (isNoteNearExpiration(note)) {
      await addNoteExpireJob(note);
    }
  }

  protected async completeHandler() {
    logger.info(`Complete from ${NoteMessageListenerType.addExpireNoteJobs}`);
  }

  protected async errorHandler(message: RedisMessage<NoteCreatedMessage>, error: unknown) {
    logger.error(error, `Error from ${NoteMessageListenerType.addExpireNoteJobs}`);
  }
}
