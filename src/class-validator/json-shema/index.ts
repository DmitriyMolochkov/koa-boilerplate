import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';
import { targetConstructorToSchema } from 'class-validator-jsonschema';
import { IOptions } from 'class-validator-jsonschema/build/options';

import { CustomDecoratorsName } from '../custom-decorators';
import { getSchemaIdByTarget, refPointerPrefix } from '../utils';

const transformOperatorsByName = {
  [CustomDecoratorsName.IsTrimmedString]: 'trim',
  [CustomDecoratorsName.IsLowercase]: 'toLowerCase',
};

const transformDecoratorNames = Object.keys(transformOperatorsByName) as
  (keyof typeof transformOperatorsByName)[];

function getTransformOperators(metadata: ValidationMetadata, options: IOptions): string[] {
  if (typeof metadata.target !== 'function') {
    return [];
  }

  const decoratorsNames = options.classValidatorMetadataStorage
    .getTargetValidationMetadatas(metadata.target, metadata.propertyName, true, true)
    .map((x) => x.name)
    .filter(Boolean)
    .reverse() as string[];

  return transformDecoratorNames
    .filter((name) => decoratorsNames.includes(name))
    .map((name) => transformOperatorsByName[name]);
}

export function constructorToJsonSchema(constructor: Constructor) {
  return {
    ...targetConstructorToSchema(constructor, {
      schemaNameField: constructor.name,
      refPointerPrefix,
      additionalConverters: {
        [CustomDecoratorsName.IsNullable]: {
          nullable: true,
        },
        [CustomDecoratorsName.IsTrimmedString]: (meta, opts) => {
          return {
            type: 'string',
            transform: getTransformOperators(meta, opts),
          };
        },
        [CustomDecoratorsName.IsLowercase]: (meta, opts) => {
          return {
            transform: getTransformOperators(meta, opts),
          };
        },
      },
    }),
    $id: getSchemaIdByTarget(constructor),
    additionalProperties: false,
  };
}
