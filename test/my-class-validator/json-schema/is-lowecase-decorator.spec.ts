import { JSONSchemaType } from 'ajv';

import { IsLowercase, IsString, constructorToJsonSchema } from '#class-validator';

describe('IsLowercase decorator', () => {
  class StringContainer {
    @IsString()
    @IsLowercase()
    public name!: string;
  }

  it('should add \'transform: ["toLowerCase"]\' to the property', () => {
    const stringContainerSchema = constructorToJsonSchema(StringContainer);

    const targetSchema: JSONSchemaType<StringContainer> = {
      $id: '/schemas/StringContainer',
      additionalProperties: false,
      type: 'object',
      properties: {
        name: {
          type: 'string',
          transform: ['toLowerCase'],
        },
      },
      required: ['name'],
    };

    expect(stringContainerSchema).toEqual(targetSchema);
  });
});
