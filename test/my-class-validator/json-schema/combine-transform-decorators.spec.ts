import { JSONSchemaType } from 'ajv';

import { IsLowercase, IsTrimmedString, constructorToJsonSchema } from '#class-validator';

describe('simultaneous use of several transform decorators', () => {
  class StringContainer {
    @IsTrimmedString()
    @IsLowercase()
    public name!: string;
  }

  it('should add \'transform: ["trim", "toLowerCase"]\' to the property', () => {
    const stringContainerSchema = constructorToJsonSchema(StringContainer);

    const targetSchema: JSONSchemaType<StringContainer> = {
      $id: '/schemas/StringContainer',
      additionalProperties: false,
      type: 'object',
      properties: {
        name: {
          type: 'string',
          transform: ['trim', 'toLowerCase'],
        },
      },
      required: ['name'],
    };

    expect(stringContainerSchema).toEqual(targetSchema);
  });
});
