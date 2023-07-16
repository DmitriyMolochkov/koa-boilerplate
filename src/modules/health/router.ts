import Router from '@koa/router';

import * as HealthController from '#modules/health/controllers';

const router = new Router({ prefix: '/health' });

router.get('/', HealthController.healthCheck);

export default router;
