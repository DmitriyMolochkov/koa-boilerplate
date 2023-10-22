import { BaseMessageListener, RedisMessage } from '#message-bus';
import { NoteMessageListenerType, NoteMessageType } from '#modules/notes/enums';
import { addNoteExpireJob, removeNoteExpireJobs } from '#modules/notes/jobs/expire-note';
import { NoteUpdatedMessage } from '#modules/notes/messages';
import * as NoteService from '#modules/notes/services';
import { isNoteNearExpiration } from '#modules/notes/utils';

export class UpdateExpireNoteJobsListener extends BaseMessageListener<NoteUpdatedMessage> {
  protected readonly haveSensitiveData = true;

  public constructor(consumerName?: string) {
    super({
      streamName: NoteMessageType.noteUpdated,
      groupName: NoteMessageListenerType.updateExpireNoteJobs,
      consumerName,
    });
  }

  protected async handler({ payload }: RedisMessage<NoteUpdatedMessage>) {
    const { previousFields, newFields } = payload;

    const previousExpirationTime = new Date(previousFields.expirationDate).getTime();
    const newExpirationTime = new Date(newFields.expirationDate).getTime();
    if (previousExpirationTime === newExpirationTime) {
      return;
    }

    const note = await NoteService.getById(payload.id);

    await removeNoteExpireJobs(note.id);
    if (isNoteNearExpiration(note)) {
      await addNoteExpireJob(note);
    }
  }
}
