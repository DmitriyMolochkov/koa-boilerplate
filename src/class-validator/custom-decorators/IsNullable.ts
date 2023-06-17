import { ValidationOptions, registerDecorator } from 'class-validator';

import CustomDecoratorsName from './CustomDecoratorsName';
import { MetadataStorage, patchMetadataStore } from '../utils';

export function IsNullable(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object: object, propertyName: string | symbol) => {
    registerDecorator({
      name: CustomDecoratorsName.IsNullable,
      target: object.constructor,
      propertyName: propertyName as string,
      constraints: [
        (_: unknown, value: unknown): boolean => {
          return value !== null;
        },
      ],
      options: validationOptions,
      validator: {
        validate: () => {
          throw new Error('IsNullable decorator: unreachable code');
        },
      },
    });

    patchMetadataStore((storage) => {
      const patchedValidationMetadatas: MetadataStorage['validationMetadatas'] = new Map();

      storage.validationMetadatas.forEach((metadatas, key) => metadatas
        .forEach((metadata) => {
          // eslint-disable-next-line prefer-object-spread
          const copy = Object.assign({}, metadata);
          if (copy.name === CustomDecoratorsName.IsNullable) {
            copy.type = 'conditionalValidation';
          }
          patchedValidationMetadatas.set(
            key,
            (patchedValidationMetadatas.get(key) ?? []).concat(copy),
          );
        }));

      // eslint-disable-next-line no-param-reassign
      storage.validationMetadatas = patchedValidationMetadatas;
    });
  };
}
