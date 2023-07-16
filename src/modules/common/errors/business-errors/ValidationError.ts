import { ValidationError as ClassValidatorError } from 'class-validator';

import { BusinessError } from '#modules/common/errors/business-errors/BusinessError';

export class ValidationError extends BusinessError {
  public readonly errors: ClassValidatorError[];

  constructor(errors: ClassValidatorError[], entityName?: string, message?: string) {
    super(
      entityName,
      undefined,
      message ?? 'Validation error encountered',
    );
    this.errors = errors;
  }
}
