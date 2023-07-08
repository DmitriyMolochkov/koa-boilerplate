import Router from '@koa/router';

const router = new Router({ prefix: '/api' });

router.get('/', (ctx) => {
  ctx.body = {
    hello: 'world',
  };
});

export default router;
