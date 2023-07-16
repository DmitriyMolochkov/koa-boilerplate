import Router from '@koa/router';

import healthRouter from '#modules/health/router';
import noteRoutes from '#modules/notes/router';

import { httpLogger, serverErrorHandler } from './middlewares';

const apiRouter = new Router({ prefix: '/api' });

// middlewares
apiRouter.use(httpLogger);
apiRouter.use(serverErrorHandler);

// routes
apiRouter.get('/', (ctx) => {
  ctx.body = {
    hello: 'world',
  };
});

apiRouter.use(healthRouter.routes());
apiRouter.use(noteRoutes.routes());

export default apiRouter;
