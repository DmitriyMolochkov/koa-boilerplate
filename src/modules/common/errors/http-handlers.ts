import { RouterContext } from '@koa/router';
import { StatusCodes } from 'http-status-codes';

import {
  AccessError,
  DuplicationError,
  NotFoundError,
  ValidationError,
} from '#modules/common/errors/business-errors';

export function validationErrorHandler(error: ValidationError) {
  return (ctx: RouterContext) => {
    const body = {
      code: error.name,
      message: error.message,
      entityName: error.entityName,
      details: error.errors,
    };
    ctx.status = StatusCodes.BAD_REQUEST;
    ctx.body = body;
  };
}

export function notFoundErrorHandler(error: NotFoundError) {
  return (ctx: RouterContext) => {
    const body = {
      code: error.name,
      message: error.message,
      entityId: error.entityId,
      entityName: error.entityName,
    };
    ctx.status = StatusCodes.NOT_FOUND;
    ctx.body = body;
  };
}

export function accessErrorHandler(error: AccessError) {
  return (ctx: RouterContext) => {
    const body = {
      code: error.name,
      message: error.message,
      entityId: error.entityId,
      entityName: error.entityName,
    };
    ctx.status = StatusCodes.FORBIDDEN;
    ctx.body = body;
  };
}

export function duplicationErrorHandler(error: DuplicationError<unknown>) {
  return (ctx: RouterContext) => {
    const body = {
      code: error.name,
      message: error.message,
      entityName: error.entityName,
      duplicationFields: error.duplicateFields,
    };
    ctx.status = StatusCodes.BAD_REQUEST;
    ctx.body = body;
  };
}
