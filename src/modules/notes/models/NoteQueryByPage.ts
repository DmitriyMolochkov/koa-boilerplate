import { PaginationMixin } from '#mixins';
import { NoteQuery } from '#modules/notes/models/NoteQuery';

export class NoteQueryByPage extends PaginationMixin(NoteQuery) {
}
