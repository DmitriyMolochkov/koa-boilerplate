import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { KoaAdapter } from '@bull-board/koa';
import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import jobQueue from '#job-queue';

import apiRouter from './api-router';

export async function init() {
  const serverAdapter = new KoaAdapter();

  createBullBoard({
    queues: Object.entries(jobQueue.queues)
      .map(([, q]) => new BullMQAdapter(q, { readOnlyMode: true })),
    serverAdapter,
  });

  serverAdapter.setBasePath('/bull-board');

  const koa = new Koa();

  koa
    .use(cors())
    .use(bodyParser({
      enableTypes: ['json'],
      jsonLimit: '10mb',
    }))
    .use(serverAdapter.registerPlugin())
    .use(apiRouter.routes());

  return koa;
}
