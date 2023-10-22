import { Middleware } from '@koa/router';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import config from '#config';
import logger from '#logger';
import { errorToObject } from '#utils';

export const serverErrorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    logger.error(error, ReasonPhrases.INTERNAL_SERVER_ERROR);
    ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;

    if (config.isProduction) {
      ctx.body = ReasonPhrases.INTERNAL_SERVER_ERROR;
      return;
    }

    if (error instanceof Error) {
      ctx.body = errorToObject(error);
    } else {
      ctx.body = error;
    }
  }
};
