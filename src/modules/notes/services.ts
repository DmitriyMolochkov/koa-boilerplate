import {
  Between,
  FindOptionsWhere,
  ILike,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

import {
  AccessError,
  DuplicationError,
  NotFoundError,
} from '#modules/common/errors/business-errors';
import Note from '#modules/notes/entities/Note';
import { NoteStatus } from '#modules/notes/enums';
import { ExampleNoteError } from '#modules/notes/error/business-errors/ExampleNoteError';
import {
  NoteCreateModel,
  NotePatchModel,
  NoteQuery,
  NoteUpdateModel,
} from '#modules/notes/models';
import { NoteQueryByPage } from '#modules/notes/models/NoteQueryByPage';

const NoteAccessError = AccessError.bind(undefined, Note.name);
const NoteDuplicationError = (DuplicationError<Note>).bind(undefined, Note.name);
const NoteNotFindError = NotFoundError.bind(undefined, Note.name);

function getSearchFilter(query: NoteQuery) {
  const searchFilter: FindOptionsWhere<Note> = {};

  if (query.searchString) {
    searchFilter.title = ILike(`%${query.searchString}%`);
  }

  if (query.statuses) {
    searchFilter.status = In(query.statuses);
  }

  if (query.startDate && query.endDate) {
    searchFilter.createdAt = Between(query.startDate, query.endDate);
  } else if (query.startDate) {
    searchFilter.createdAt = MoreThanOrEqual(query.startDate);
  } else if (query.endDate) {
    searchFilter.createdAt = LessThanOrEqual(query.endDate);
  }

  return searchFilter;
}

export async function array(query: NoteQuery = {}) {
  return Note.find({
    where: getSearchFilter(query),
    order: { id: 'asc' },
  });
}

export async function list(queryByPage: NoteQueryByPage) {
  return Note.findAndCount({
    where: getSearchFilter(queryByPage),
    ...queryByPage.ormOpts,
    order: { id: 'asc' },
  });
}

export async function getById(id: Note['id']) {
  const note = await Note.findOneBy({ id });
  if (!note) {
    throw new NoteNotFindError(id);
  }

  return note;
}

export async function create(createModel: NoteCreateModel) {
  const existNote = await Note.findOneBy({ title: createModel.title });
  if (existNote) {
    throw new NoteDuplicationError(['title']);
  }

  const note = Note.create({
    ...createModel,
    status: NoteStatus.active,
  });
  await note.save();

  return note;
}

export async function update(
  id: Note['id'],
  updateModel: NoteUpdateModel | Partial<NotePatchModel>,
) {
  const note = await Note.findOneBy({ id });

  if (!note) {
    throw new NoteNotFindError(id);
  }

  if (note.status === NoteStatus.expired) {
    throw new NoteAccessError(
      note.id,
      `It is forbidden to update a note in the '${note.status}' status`,
    );
  }

  if (updateModel.title) {
    const existNote = await Note.findOneBy({ id: Not(id), title: updateModel.title });
    if (existNote) {
      throw new NoteDuplicationError(['title']);
    }
  }

  Note.merge(note, { ...updateModel });
  await note.save();

  return note;
}

export async function remove(id: Note['id']) {
  const note = await Note.findOneBy({ id });

  if (!note) {
    throw new NoteNotFindError(id);
  }

  await note.remove();
}

export async function changeStatus(
  id: Note['id'],
  status: NoteStatus,
  acceptableStatuses?: NoteStatus[],
) {
  const note = await Note.findOneBy({ id });

  if (!note) {
    throw new NoteNotFindError(id);
  }

  if (acceptableStatuses && !acceptableStatuses.includes(note.status)) {
    throw new NoteAccessError(
      note.id,
      `Note record is in invalid status '${note.status}'.`
      + ` Valid statuses are: ${acceptableStatuses.join(', ')}.`,
    );
  }

  note.status = status;
  await note.save();

  return note;
}

export async function exampleError(id: Note['id']) {
  const note = await Note.findOneBy({ id });

  if (!note) {
    throw new NoteNotFindError(id);
  }

  throw new ExampleNoteError(note);
}
