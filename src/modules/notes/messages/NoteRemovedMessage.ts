import { BaseMessage } from '#message-bus';
import Note from '#modules/notes/entities/Note';
import { NoteMessageType } from '#modules/notes/enums';

type Versions = 'v1';

type PayloadType<Version extends Versions> = {
  v1: {
    id: Note['id'];
  };
}[Version];

export class NoteRemovedMessage<Version extends Versions = Versions>
  extends BaseMessage<NoteMessageType.noteRemoved> {
  public version: Version;
  public payload: PayloadType<typeof this.version>;

  public constructor(id: Note['id'], version: Version & 'v1' = 'v1' as never) {
    super(NoteMessageType.noteRemoved);
    this.version = version;
    const payload: PayloadType<typeof version> = {
      id,
    };
    this.payload = payload;
  }
}
