import { ParsedUrlQuery } from 'querystring';

import { RouterContext } from '@koa/router';
import * as Koa from 'koa';
import { Context } from 'koa';

type KoaRequest<RequestBody> = Context['request'] & {
  body: RequestBody;
};

export interface KoaContext<
  RequestBody = object,
  ResponseBody = undefined,
  RequestParams extends Record<string, string> = Record<string, string>,
  QueryParams extends ParsedUrlQuery = ParsedUrlQuery,
> extends RouterContext<Koa.DefaultState, Koa.DefaultContext, ResponseBody> {
  request: KoaRequest<RequestBody>;
  params: RequestParams;
  query: QueryParams;
}
