// eslint-disable-next-line max-classes-per-file
import { JSONSchemaType } from 'ajv';

import { IsNumber, IsString, constructorToJsonSchema } from '#class-validator';

import {
  ASCII_CYRILLIC_REG_EXP,
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  PASSWORD_REG_EXP,
} from '../constants.spec-helper';
import { UserSex } from '../models/index.spec-helper';
import UserCreateModel from '../models/UserCreateModel.spec-helper';

describe('child class JSON schema', () => {
  it('should be find for the class with no new fields', () => {
    class UserUpdateModel extends UserCreateModel {}

    const userUpdateSchema = constructorToJsonSchema(UserUpdateModel);

    const targetSchema: JSONSchemaType<UserUpdateModel> = {
      $id: '/schemas/UserUpdateModel',
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

    expect(userUpdateSchema).toEqual(targetSchema);
  });

  it('should contains new fields', () => {
    class UserUpdateModel extends UserCreateModel {
      @IsNumber()
      public id!: number;
    }

    const userUpdateSchema = constructorToJsonSchema(UserUpdateModel);

    const targetSchema: JSONSchemaType<UserUpdateModel> = {
      $id: '/schemas/UserUpdateModel',
      additionalProperties: false,
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
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
      required: ['id', 'userName', 'password', 'sex', 'email'],
    };

    expect(userUpdateSchema).toEqual(targetSchema);
  });

  it('should rewrite the old rules with new ones for the fields', () => {
    class UserUpdateModel extends UserCreateModel {
      @IsString()
      public declare password: string;
    }

    const userUpdateSchema = constructorToJsonSchema(UserUpdateModel);

    const targetSchema: JSONSchemaType<UserUpdateModel> = {
      $id: '/schemas/UserUpdateModel',
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
      required: ['password', 'userName', 'sex', 'email'],
    };

    expect(userUpdateSchema).toEqual(targetSchema);
  });
});
