import { BusinessError } from '#modules/common/errors/business-errors/BusinessError';

export class NotFoundError extends BusinessError {
  constructor(
    entityName?: string,
    entityId?: number,
    message?: string,
  ) {
    super(
      entityName,
      entityId,
      message ?? `${entityName ?? 'Entity'} not found`,
    );
  }
}
