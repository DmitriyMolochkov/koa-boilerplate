import { StatusCodes } from 'http-status-codes';

import { IdParam, KoaContext, ViewByPage } from '#modules/common/models';
import { NoteStatus } from '#modules/notes/enums';
import {
  NoteCreateModel,
  NotePatchModel,
  NoteQuery,
  NoteShortView,
  NoteUpdateModel,
  NoteView,
} from '#modules/notes/models';
import { NoteQueryByPage } from '#modules/notes/models/NoteQueryByPage';
import * as NoteService from '#modules/notes/services';

export async function array(
  ctx: KoaContext<
    object,
    NoteShortView[],
    Record<string, string>,
    NoteQuery
  >,
) {
  const notes = await NoteService.array(ctx.query);

  ctx.body = NoteShortView.fromArray(notes);
}

export async function list(
  ctx: KoaContext<
      object,
      ViewByPage<NoteShortView>,
      Record<string, string>,
      NoteQueryByPage
    >,
) {
  const [notes, total] = await NoteService.list(ctx.query);

  ctx.body = new ViewByPage(NoteShortView.fromArray(notes), total);
}

export async function entity(ctx: KoaContext<object, NoteView, IdParam>) {
  const note = await NoteService.getById(ctx.params.id);

  ctx.body = new NoteView(note);
}

export async function create(ctx: KoaContext<NoteCreateModel, NoteView>) {
  const note = await NoteService.create(ctx.request.body);

  ctx.status = StatusCodes.CREATED;
  ctx.body = new NoteView(note);
}

export async function update(ctx: KoaContext<NoteUpdateModel, NoteView, IdParam>) {
  const note = await NoteService.getById(ctx.params.id);

  await NoteService.update(note, ctx.request.body);

  ctx.body = new NoteView(note);
}

export async function patch(ctx: KoaContext<Partial<NotePatchModel>, NoteView, IdParam>) {
  const note = await NoteService.getById(ctx.params.id);

  await NoteService.update(note, ctx.request.body);

  ctx.body = new NoteView(note);
}

export async function remove(ctx: KoaContext<object, undefined, IdParam>) {
  await NoteService.remove(ctx.params.id);

  ctx.status = StatusCodes.NO_CONTENT;
}

export async function activate(ctx: KoaContext<object, NoteView, IdParam>) {
  const note = await NoteService.getById(ctx.params.id);

  await NoteService.changeStatus(
    note,
    NoteStatus.active,
    [NoteStatus.inactive],
  );

  ctx.body = new NoteView(note);
}

export async function deactivate(ctx: KoaContext<object, NoteView, IdParam>) {
  const note = await NoteService.getById(ctx.params.id);

  await NoteService.changeStatus(
    note,
    NoteStatus.inactive,
    [NoteStatus.active],
  );

  ctx.body = new NoteView(note);
}

export async function exampleError(ctx: KoaContext<object, undefined, IdParam>) {
  await NoteService.exampleError(ctx.params.id);

  ctx.status = StatusCodes.NO_CONTENT;
}

export async function exampleServerError() {
  throw new Error('Example server error. For demonstration purposes only.');
}
