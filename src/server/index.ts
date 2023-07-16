import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import apiRouter from './api-router';

export async function init() {
  const koa = new Koa();

  koa
    .use(cors())
    .use(bodyParser({
      enableTypes: ['json'],
      jsonLimit: '10mb',
    }))
    .use(apiRouter.routes());

  return koa;
}
