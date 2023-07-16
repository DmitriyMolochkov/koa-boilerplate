import Router from '@koa/router';

import healthRouter from '#modules/health/router';
import noteRoutes from '#modules/notes/router';

import { commonErrorHandler, httpLogger, serverErrorHandler } from './middlewares';

const apiRouter = new Router({ prefix: '/api' });

// middlewares
apiRouter.use(httpLogger);
apiRouter.use(serverErrorHandler);
apiRouter.use(commonErrorHandler);

// routes
apiRouter.use(healthRouter.routes());
apiRouter.use(noteRoutes.routes());

export default apiRouter;
