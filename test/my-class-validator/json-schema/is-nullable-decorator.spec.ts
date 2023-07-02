import { JSONSchemaType } from 'ajv';

import { constructorToJsonSchema } from '#class-validator';

import {
  ASCII_CYRILLIC_REG_EXP,
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  PASSWORD_REG_EXP,
} from '../constants.spec-helper';
import { UserCreateModel, UserSex } from '../models/index.spec-helper';

describe('IsNullable decorator', () => {
  it('should add \'nullable: true\' to property', () => {
    const userCreateSchema = constructorToJsonSchema(UserCreateModel);

    const targetSchema: JSONSchemaType<UserCreateModel> = {
      $id: '/schemas/UserCreateModel',
      additionalProperties: false,
      type: 'object',
      properties: {
        userName: {
          type: 'string',
          transform: ['trim'],
          pattern: ASCII_CYRILLIC_REG_EXP.source,
          minLength: MIN_USERNAME_LENGTH,
          maxLength: MAX_USERNAME_LENGTH,

        },
        password: {
          type: 'string',
          pattern: PASSWORD_REG_EXP.source,
          minLength: MIN_PASSWORD_LENGTH,
          maxLength: MAX_PASSWORD_LENGTH,
        },
        sex: {
          type: 'string',
          enum: Object.values(UserSex),
        },
        email: {
          type: 'string',
          nullable: true,
          format: 'email',
        },
      },
      required: ['userName', 'password', 'sex', 'email'],
    };

    expect(userCreateSchema).toEqual(targetSchema);
  });
});
