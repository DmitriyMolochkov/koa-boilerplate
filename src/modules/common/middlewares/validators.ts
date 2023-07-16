import { Middleware } from '@koa/router';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { ValidationError } from '#modules/common/errors/business-errors/ValidationError';

type StrR = Record<string, string>;

async function transformAndValidateObject<T extends object>(
  SchemaModel: Constructor<T>,
  object: unknown,
) {
  const entityInstance = plainToInstance(SchemaModel, object);
  const errors = await validate(entityInstance, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  if (errors.length > 0) {
    throw new ValidationError(errors, SchemaModel.name);
  }

  return entityInstance;
}

export function validateBody(schemaModel: Constructor): Middleware {
  return async (ctx, next) => {
    ctx.request.body = await transformAndValidateObject(schemaModel, ctx.request.body);

    await next();
  };
}

export function validateQuery<T extends StrR>(schemaModel: Constructor<T>): Middleware {
  return async (ctx, next) => {
    const value = await transformAndValidateObject(schemaModel, ctx.query);
    // 'query' is a property, we should redefine it with the 'writable' flag set to true
    // in order to overwrite its value
    Reflect.defineProperty(ctx, 'query', {
      configurable: true,
      value: undefined,
      writable: true,
    });
    ctx.query = value;

    await next();
  };
}

export function validatePathParams<T extends StrR>(schemaModel: Constructor<T>): Middleware {
  return async (ctx, next) => {
    ctx.params = await transformAndValidateObject(schemaModel, ctx.params);

    await next();
  };
}
