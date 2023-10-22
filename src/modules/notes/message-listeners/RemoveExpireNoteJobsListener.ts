import { BaseMessageListener, RedisMessage } from '#message-bus';
import { NoteMessageListenerType, NoteMessageType } from '#modules/notes/enums';
import { removeNoteExpireJobs } from '#modules/notes/jobs/expire-note';
import { NoteRemovedMessage } from '#modules/notes/messages';
import * as NoteService from '#modules/notes/services';

export class RemoveExpireNoteJobsListener extends BaseMessageListener<NoteRemovedMessage> {
  protected readonly haveSensitiveData = false;

  public constructor(consumerName?: string) {
    super({
      streamName: NoteMessageType.noteRemoved,
      groupName: NoteMessageListenerType.removeExpireJobs,
      consumerName,
    });
  }

  protected async handler({ payload }: RedisMessage<NoteRemovedMessage>) {
    const note = await NoteService.getById(payload.id);

    await removeNoteExpireJobs(note.id);
  }
}
