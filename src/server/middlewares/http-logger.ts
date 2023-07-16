import { ParsedUrlQuery } from 'querystring';

import { Middleware } from '@koa/router';
import { instanceToPlain } from 'class-transformer';
import { ParameterizedContext } from 'koa';
import { isEmpty, isPlainObject } from 'lodash-es';
import pinoHttp, { startTime } from 'pino-http';

import logger, { maskedFieldValue } from '#logger';

type RequestRawWrapper<T> = T & { raw: T };
type ResponseRawWrapper<T> = T & { raw: { locals: T } };

const loggerInstance = pinoHttp({
  logger,
  customLogLevel(req, res, err) {
    if (res.statusCode >= 500 || err) {
      return 'error';
    }
    if (res.statusCode >= 400) {
      return 'warn';
    }

    return 'info';
  },
  customSuccessMessage(req, res) {
    return `request completed with ${res.statusCode}: ${req.method ?? ''} ${req.url ?? ''}`;
  },
  customErrorMessage(req, res) {
    return `request errored with ${res.statusCode}: ${req.method ?? ''} ${req.url ?? ''}`;
  },
  serializers: {
    req(
      req: ParameterizedContext['req'] & RequestRawWrapper<{ query: ParsedUrlQuery; body: unknown }>,
    ) {
      req.query = req.raw.query;
      req.body = req.raw.body;

      return req;
    },
    res(res: ParameterizedContext['res'] & ResponseRawWrapper<{ body: unknown }>) {
      res.body = res.raw.locals.body;

      return res;
    },
  },
});

function getReqAndResForLogging(ctx: ParameterizedContext) {
  const needLoggingBody = !ctx.request.body
    || isEmpty(ctx.request.body)
    // if it's a plain object, then it didn't pass the validation middleware
    // which means the body may contain sensitive/secret information that we cannot delete
    || !isPlainObject(ctx.request.body);

  function getBodyForLogging(body: unknown) {
    return needLoggingBody
      // If the version is NaN, then properties are masked by the LogExclude decorators
      ? instanceToPlain(body, { version: NaN })
      : maskedFieldValue;
  }

  const request = Object.assign(
    ctx.req,
    {
      body: getBodyForLogging(ctx.request.body),
      query: ctx.query,
    },
  );

  const response = Object.assign(
    ctx.res,
    {
      locals: {
        body: getBodyForLogging(ctx.body),
      },
    },
  );

  return { request, response };
}

const httpLogger: Middleware = async (ctx, next) => {
  ctx.res[startTime] = Date.now();
  logger.info(`request received: ${ctx.request.method} ${ctx.request.url}`);

  await next();
  // logging on the way back to remove sensitive/secret fields from logging

  const { request, response } = getReqAndResForLogging(ctx);

  loggerInstance(request, response);
};

export {
  httpLogger,
};
