import Router from '@koa/router';

import { serverErrorHandler } from './middlewares';

const apiRouter = new Router({ prefix: '/api' });

// middlewares
apiRouter.use(serverErrorHandler);

// routes
apiRouter.get('/', (ctx) => {
  ctx.body = {
    hello: 'world',
  };
});

export default apiRouter;
