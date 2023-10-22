import { BaseMessage } from '#message-bus';
import Note from '#modules/notes/entities/Note';
import { NoteMessageType } from '#modules/notes/enums';

type Versions = 'v1' | 'v2';

export type PayloadType<Version extends Versions> = {
  v1: {
    id: Note['id'];
  };
  v2: {
    id: Note['id'];
    description: string;
  };
}[Version];

export class NoteExpiredMessage<Version extends Versions = Versions>
  extends BaseMessage<NoteMessageType.noteExpired> {
  public version: Version;
  public payload: PayloadType<Version>;

  public constructor(note: Note, version: Version & 'v2' = 'v2' as never) {
    super(NoteMessageType.noteExpired);
    this.version = version;
    const payload: PayloadType<typeof version> = {
      id: note.id,
      description: 'Example implementation of message version \'v2\'!',
    };
    this.payload = payload;
  }
}
