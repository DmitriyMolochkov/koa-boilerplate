import { LogExclude } from '#logger';
import { ViewMixin } from '#mixins';
import Note from '#modules/notes/entities/Note';
import { NoteStatus } from '#modules/notes/enums/NoteStatus';

class BaseNoteShortView {
  readonly id: number;
  readonly title: string;
  readonly status: NoteStatus;
  @LogExclude() readonly expirationDate!: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(entity: Note) {
    this.id = entity.id;
    this.title = entity.title;
    this.status = entity.status;
    this.expirationDate = entity.expirationDate;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

export class NoteShortView extends ViewMixin(BaseNoteShortView) {
}
