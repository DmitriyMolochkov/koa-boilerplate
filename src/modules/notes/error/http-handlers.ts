import { RouterContext } from '@koa/router';
import { StatusCodes } from 'http-status-codes';

import { ExampleNoteError } from '#modules/notes/error/business-errors/ExampleNoteError';

export function exampleErrorHandler(error: ExampleNoteError) {
  return (ctx: RouterContext) => {
    const body = {
      code: error.name,
      message: error.message,
      entityName: error.entityName,
      entityId: error.entityId,
    };
    ctx.status = StatusCodes.BAD_REQUEST;
    ctx.body = body;
  };
}
