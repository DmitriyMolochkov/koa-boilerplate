import { LogExclude } from '#logger';
import { ViewMixin } from '#mixins';
import Note from '#modules/notes/entities/Note';
import { NoteStatus } from '#modules/notes/enums/NoteStatus';

class NoteBaseView {
  readonly id!: number;
  readonly title!: string;
  readonly description!: string | null;
  readonly status!: NoteStatus;
  @LogExclude() readonly text!: string;
  @LogExclude() readonly expirationDate!: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(entity: Note) {
    this.id = entity.id;
    this.title = entity.title;
    this.description = entity.description;
    this.status = entity.status;
    this.text = entity.text;
    this.expirationDate = entity.expirationDate;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

export class NoteView extends ViewMixin(NoteBaseView) {}
