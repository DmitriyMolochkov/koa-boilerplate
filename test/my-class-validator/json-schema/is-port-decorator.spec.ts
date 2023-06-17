import { JSONSchemaType } from 'ajv';

import { IsPort, constructorToJsonSchema } from '#class-validator';

describe('IsPort decorator', () => {
  class PortContainer {
    @IsPort()
    public port!: number;
  }

  it('should add port constraints to the property', () => {
    const portContainerSchema = constructorToJsonSchema(PortContainer);

    const targetSchema: JSONSchemaType<PortContainer> = {
      type: 'object',
      properties: {
        port: {
          type: 'number',
          minimum: 0,
          maximum: 65535,
        },
      },
      required: ['port'],
    };

    expect(portContainerSchema).toEqual(targetSchema);
  });
});
