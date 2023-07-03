import { IS_EMAIL, Validator } from 'class-validator';

import { UserCreateModel, UserSex } from '../models/index.spec-helper';

const validator = new Validator();

describe('IsNullable decorator', () => {
  it('should allow a defined field if it is valid for other rules', () => {
    const userCreateModel = new UserCreateModel(
      'Miki',
      'gravipushka!2D',
      UserSex.female,
      'check@mail.ru',
    );

    return validator.validate(userCreateModel).then((errors) => {
      expect(errors.length).toEqual(0);
    });
  });

  it('should allow a defined field if it is null', () => {
    const userCreateModel = new UserCreateModel(
      'Miki',
      'gravipushka!2D',
      UserSex.female,
      null,
    );

    return validator.validate(userCreateModel).then((errors) => {
      expect(errors.length).toEqual(0);
    });
  });

  it('should disallow a defined field if it is not valid for other rules', () => {
    const userCreateModel = new UserCreateModel(
      'Miki',
      'gravipushka!2D',
      UserSex.female,
      'not_valid_email@',
    );

    return validator.validate(userCreateModel).then((errors) => {
      expect(errors[0]?.target).toEqual(userCreateModel);
      expect(errors[0]?.value).toEqual('not_valid_email@');
      expect(errors[0]?.property).toEqual('email');
      expect(errors[0]?.constraints).toEqual({ [IS_EMAIL]: 'email must be an email' });
    });
  });

  it('should disallow an undefined field if it is not valid for other rules', () => {
    const userCreateModel = new UserCreateModel(
      'Miki',
      'gravipushka!2D',
      UserSex.female,
      undefined as unknown as string,
    );

    return validator.validate(userCreateModel).then((errors) => {
      expect(errors[0]?.target).toEqual(userCreateModel);
      expect(errors[0]?.value).toBeUndefined();
      expect(errors[0]?.property).toEqual('email');
      expect(errors[0]?.constraints).toEqual({ [IS_EMAIL]: 'email must be an email' });
    });
  });
});
