import {
  Between,
  FindOptionsWhere,
  ILike,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

import logger from '#logger';
import messageBus from '#message-bus';
import {
  AccessError,
  DuplicationError,
  NotFoundError,
} from '#modules/common/errors/business-errors';
import Note from '#modules/notes/entities/Note';
import { NoteStatus } from '#modules/notes/enums';
import { ExampleNoteError } from '#modules/notes/error/business-errors';
import {
  NoteCreatedMessage,
  NoteExpiredMessage,
  NoteRemovedMessage,
  NoteStatusChangedMessage,
  NoteUpdatedMessage,
} from '#modules/notes/messages';
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

  logger.info({ id: note.id }, `${Note.name} created`);

  await messageBus.addMessage(new NoteCreatedMessage(note));

  return note;
}

export async function update(
  note: Note,
  updateModel: NoteUpdateModel | Partial<NotePatchModel>,
) {
  if (note.status === NoteStatus.expired) {
    throw new NoteAccessError(
      note.id,
      `It is forbidden to update a note in the '${note.status}' status`,
    );
  }

  if (updateModel.title) {
    const existNote = await Note.findOneBy({ id: Not(note.id), title: updateModel.title });
    if (existNote) {
      throw new NoteDuplicationError(['title']);
    }
  }

  const previousFields = {
    title: note.title,
    description: note.description,
    expirationDate: note.expirationDate,
    text: note.text,
  };

  Note.merge(note, { ...updateModel });
  await note.save();

  logger.info({ id: note.id }, `${Note.name} updated`);

  await messageBus.addMessage(new NoteUpdatedMessage(previousFields, note));

  return note;
}

export async function remove(id: Note['id']) {
  const note = await Note.findOneBy({ id });

  if (!note) {
    throw new NoteNotFindError(id);
  }

  await note.remove();

  logger.info({ id }, `${Note.name} removed`);

  await messageBus.addMessage(new NoteRemovedMessage(id));
}

export async function changeStatus(
  note: Note,
  status: NoteStatus,
  acceptableStatuses?: NoteStatus[],
) {
  const previousStatus = note.status;

  if (acceptableStatuses && !acceptableStatuses.includes(previousStatus)) {
    throw new NoteAccessError(
      note.id,
      `Note record is in invalid status '${note.status}'.`
      + ` Valid statuses are: ${acceptableStatuses.join(', ')}.`,
    );
  }

  note.status = status;
  await note.save();

  logger.info(
    {
      id: note.id,
      previousStatus,
      newState: note.status,
    },
    `${Note.name} status updated`,
  );

  await messageBus.addMessage(new NoteStatusChangedMessage(previousStatus, note));

  return note;
}

export async function expireNote(note: Note) {
  note.text = note.text.replace(/\p{L}/gu, '*');

  await changeStatus(
    note,
    NoteStatus.expired,
    [
      NoteStatus.active,
      NoteStatus.inactive,
    ],
  );

  logger.info({ id: note.id }, 'Note expired');

  await messageBus.addMessage(new NoteExpiredMessage(note));
}

export async function exampleError(id: Note['id']) {
  const note = await Note.findOneBy({ id });

  if (!note) {
    throw new NoteNotFindError(id);
  }

  throw new ExampleNoteError(note);
}
