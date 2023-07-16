import { BusinessError } from '#modules/common/errors/business-errors/BusinessError';

export class AccessError extends BusinessError {
  constructor(
    entityName?: string,
    entityId?: number,
    message?: string,
  ) {
    super(
      entityName,
      entityId,
      message ?? `Access to the ${entityName ?? 'Entity'} denied`,
    );
  }
}
