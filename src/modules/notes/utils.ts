import { HOURS_UNTIL_NEAR_NOTE_EXPIRATION } from '#modules/notes/constants';
import Note from '#modules/notes/entities/Note';
import { NoteStatus } from '#modules/notes/enums';

export function getDateToNearNoteExpiration() {
  const targetDate = new Date();
  targetDate.setHours(targetDate.getHours() + HOURS_UNTIL_NEAR_NOTE_EXPIRATION);

  return targetDate;
}

export function isNoteNearExpiration(note: Note) {
  const result = note.status !== NoteStatus.expired
    && note.expirationDate < getDateToNearNoteExpiration();

  return result;
}
