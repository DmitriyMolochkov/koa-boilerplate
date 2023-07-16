import { BusinessError } from '#modules/common/errors/business-errors/BusinessError';

export class DuplicationError<T = object> extends BusinessError {
  public readonly duplicateFields?: (keyof T)[];

  constructor(
    entityName?: string,
    duplicateFields?: (keyof T)[],
    message?: string,
  ) {
    super(
      entityName,
      undefined,
      message ?? `A duplicate ${entityName ?? 'Entity'} has been found`,
    );

    this.duplicateFields = duplicateFields;
  }
}
