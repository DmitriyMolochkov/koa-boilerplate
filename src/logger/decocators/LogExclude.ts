import { Transform } from 'class-transformer';
import {
  ClassTransformOptions,
} from 'class-transformer/types/interfaces/class-transformer-options.interface';

import { maskedFieldValue } from '../constants';

export function LogExclude() {
  return Transform(({ value, options }: { value: unknown; options: ClassTransformOptions }) => {
    return (value !== undefined && Number.isNaN(options.version))
      ? maskedFieldValue
      : value;
  });
}
