import { plainToClass } from 'class-transformer';

import {
  CustomDecoratorsName,
  IsLowercase,
  IsString,
  Validator,
} from '#class-validator';

const validator = new Validator();

describe('IsLowerCase decorator', () => {
  class StringContainer {
    @IsString()
    @IsLowercase()
    public name: string;

    constructor(name: string) {
      this.name = name;
    }
  }

  it('should allow a lowercase string', () => {
    const stringContainer = new StringContainer('some lowercase string');

    return validator.validate(stringContainer).then((errors) => {
      expect(errors.length).toEqual(0);
    });
  });

  it('should disallow a string with capital letters', () => {
    const stringContainer = new StringContainer('Some string with Capital Letters');

    return validator.validate(stringContainer).then((errors) => {
      expect(errors[0]?.target).toEqual(stringContainer);
      expect(errors[0]?.value).toEqual('Some string with Capital Letters');
      expect(errors[0]?.property).toEqual('name');
      expect(errors[0]?.constraints).toEqual({
        [CustomDecoratorsName.IsLowercase]: 'name must be a lowercase string',
      });
    });
  });

  it('should allow a string with capital letters after transform', () => {
    const stringContainer = plainToClass(
      StringContainer,
      new StringContainer('Some string with Capital Letters'),
    );

    return validator.validate(stringContainer).then((errors) => {
      expect(errors.length).toEqual(0);
    });
  });
});
