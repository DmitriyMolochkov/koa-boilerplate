import {
  IsInt,
  Max,
  Min,
  ValidationOptions,
} from 'class-validator';

export function IsPort(validationOptions?: ValidationOptions) {
  const isInt = IsInt(validationOptions);
  const min = Min(0, validationOptions);
  const max = Max(65535, validationOptions);

  return (target: object, key: string) => {
    isInt(target, key);
    min(target, key);
    max(target, key);
  };
}
