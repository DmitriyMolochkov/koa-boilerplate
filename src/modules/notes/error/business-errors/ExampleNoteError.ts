import { BusinessError } from '#modules/common/errors/business-errors/BusinessError';
import Note from '#modules/notes/entities/Note';

export class ExampleNoteError extends BusinessError {
  constructor(
    note: Note,
  ) {
    super(
      Note.name,
      note.id,
      'Example of a specific custom error for the note module only',
    );
  }
}
