import { BaseMessage } from '#message-bus';
import Note from '#modules/notes/entities/Note';
import { NoteMessageType } from '#modules/notes/enums';
import { NoteUpdateModel } from '#modules/notes/models';

type Versions = 'v1';

type NoteFields = Omit<NoteUpdateModel, 'expirationDate'> & { expirationDate: string };

type PayloadType<Version extends Versions> = {
  v1: {
    id: Note['id'];
    previousFields: NoteFields;
    newFields: NoteFields;
  };
}[Version];

export class NoteUpdatedMessage<Version extends Versions = Versions>
  extends BaseMessage<NoteMessageType.noteUpdated> {
  public version: Version;
  public payload: PayloadType<typeof this.version>;

  public constructor(
    previousFields: NoteUpdateModel,
    note: Note,
    version: Version & 'v1' = 'v1' as never,
  ) {
    super(NoteMessageType.noteUpdated);
    this.version = version;
    const payload: PayloadType<typeof version> = {
      id: note.id,
      previousFields: {
        ...previousFields,
        expirationDate: previousFields.expirationDate.toISOString(),
      },
      newFields: {
        title: note.title,
        description: note.description,
        expirationDate: note.expirationDate.toISOString(),
        text: note.text,
      },
    };
    this.payload = payload;
  }
}
