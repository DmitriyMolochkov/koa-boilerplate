import { JSONSchemaType } from 'ajv';

import { IsTrimmedString, constructorToJsonSchema } from '#class-validator';

describe('IsTrimmedString decorator', () => {
  class StringContainer {
    @IsTrimmedString()
    public name!: string;
  }

  it('should add \'transform: ["trim"]\' to the property', () => {
    const stringContainerSchema = constructorToJsonSchema(StringContainer);

    const targetSchema: JSONSchemaType<StringContainer> = {
      $id: '/schemas/StringContainer',
      additionalProperties: false,
      type: 'object',
      properties: {
        name: {
          type: 'string',
          transform: ['trim'],
        },
      },
      required: ['name'],
    };

    expect(stringContainerSchema).toEqual(targetSchema);
  });
});
