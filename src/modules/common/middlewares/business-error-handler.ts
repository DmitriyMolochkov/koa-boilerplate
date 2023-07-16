import { Middleware, RouterContext } from '@koa/router';

import { BusinessError } from '#modules/common/errors/business-errors/BusinessError';

export default (
  getHandlerFn: (error: BusinessError) => ((ctx: RouterContext) => void) | undefined,
): Middleware => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      if (!(error instanceof BusinessError)) {
        throw error;
      }

      const handlerFn = getHandlerFn(error);
      if (!handlerFn) {
        throw error;
      }

      handlerFn(ctx);
    }
  };
};
