import { BaseMessage } from '#message-bus';
import Note from '#modules/notes/entities/Note';
import { NoteMessageType } from '#modules/notes/enums';

type Versions = 'v1';

type PayloadType<Version extends Versions> = {
  v1: {
    id: Note['id'];
    previousStatus: Note['status'];
    newStatus: Note['status'];
  };
}[Version];

export class NoteStatusChangedMessage<Version extends Versions = Versions>
  extends BaseMessage<NoteMessageType.noteStatusChanged> {
  public version: Version;
  public payload: PayloadType<typeof this.version>;

  public constructor(
    previousStatus: Note['status'],
    note: Note,
    version: Version & 'v1' = 'v1' as never,
  ) {
    super(NoteMessageType.noteStatusChanged);
    this.version = version;
    const payload: PayloadType<typeof version> = {
      id: note.id,
      previousStatus,
      newStatus: note.status,
    };
    this.payload = payload;
  }
}
