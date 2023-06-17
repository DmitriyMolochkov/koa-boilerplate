import { Transform, TransformFnParams, TransformOptions } from 'class-transformer';
import { ValidationOptions, IsLowercase as _IsLowercase } from 'class-validator';

export function IsLowercase(
  validationOptions?: ValidationOptions,
  transformOptions?: TransformOptions,
) {
  const toLowerCase = Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }

    return value as unknown;
  }, transformOptions);

  const isLowerCase = _IsLowercase(transformOptions);

  return (target: object, key: string) => {
    toLowerCase(target, key);
    isLowerCase(target, key);
  };
}
