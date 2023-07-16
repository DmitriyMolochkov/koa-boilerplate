import {
  AccessError,
  DuplicationError,
  NotFoundError,
  ValidationError,
} from '#modules/common/errors/business-errors';
import {
  accessErrorHandler,
  duplicationErrorHandler,
  notFoundErrorHandler,
  validationErrorHandler,
} from '#modules/common/errors/http-handlers';
import businessErrorHandler from '#modules/common/middlewares/business-error-handler';

export const commonErrorHandler = businessErrorHandler((error) => {
  if (error instanceof ValidationError) {
    return validationErrorHandler(error);
  }
  if (error instanceof NotFoundError) {
    return notFoundErrorHandler(error);
  }
  if (error instanceof AccessError) {
    return accessErrorHandler(error);
  }
  if (error instanceof DuplicationError<unknown>) {
    return duplicationErrorHandler(error);
  }

  return undefined;
});
