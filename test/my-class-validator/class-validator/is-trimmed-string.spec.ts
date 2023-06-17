import { plainToClass } from 'class-transformer';

import { CustomDecoratorsName, IsTrimmedString, Validator } from '#class-validator';

const validator = new Validator();

describe('IsTrimmedString decorator', () => {
  class StringContainer {
    @IsTrimmedString()
    public name: string;

    constructor(name: string) {
      this.name = name;
    }
  }

  it('should allow a trimmed string', () => {
    const stringContainer = new StringContainer('Some trimmed string');

    return validator.validate(stringContainer).then((errors) => {
      expect(errors.length).toEqual(0);
    });
  });

  it('should disallow a string with spaces at the ends', () => {
    const stringContainer = new StringContainer(' Some untrimmed string ');

    return validator.validate(stringContainer).then((errors) => {
      expect(errors[0]?.target).toEqual(stringContainer);
      expect(errors[0]?.value).toEqual(' Some untrimmed string ');
      expect(errors[0]?.property).toEqual('name');
      expect(errors[0]?.constraints).toEqual({
        [CustomDecoratorsName.IsTrimmedString]: 'name must be a trimmed string',
      });
    });
  });

  it('should allow an untrimmed string after transform', () => {
    const stringContainer = plainToClass(
      StringContainer,
      new StringContainer(' Some untrimmed string '),
    );

    return validator.validate(stringContainer).then((errors) => {
      expect(errors.length).toEqual(0);
    });
  });

  it('should disallow a string with a space at the start', () => {
    const stringContainer = new StringContainer(' Some untrimmed string');

    return validator.validate(stringContainer).then((errors) => {
      expect(errors[0]?.target).toEqual(stringContainer);
      expect(errors[0]?.value).toEqual(' Some untrimmed string');
      expect(errors[0]?.property).toEqual('name');
      expect(errors[0]?.constraints).toEqual({
        [CustomDecoratorsName.IsTrimmedString]: 'name must be a trimmed string',
      });
    });
  });

  it('should disallow a string with a space at the end', () => {
    const stringContainer = new StringContainer('Some untrimmed string ');

    return validator.validate(stringContainer).then((errors) => {
      expect(errors[0]?.target).toEqual(stringContainer);
      expect(errors[0]?.value).toEqual('Some untrimmed string ');
      expect(errors[0]?.property).toEqual('name');
      expect(errors[0]?.constraints).toEqual({
        [CustomDecoratorsName.IsTrimmedString]: 'name must be a trimmed string',
      });
    });
  });

  it('should disallow a string with a \\n symbol at the end', () => {
    const stringContainer = new StringContainer('Some untrimmed string\n');

    return validator.validate(stringContainer).then((errors) => {
      expect(errors[0]?.target).toEqual(stringContainer);
      expect(errors[0]?.value).toEqual('Some untrimmed string\n');
      expect(errors[0]?.property).toEqual('name');
      expect(errors[0]?.constraints).toEqual({
        [CustomDecoratorsName.IsTrimmedString]: 'name must be a trimmed string',
      });
    });
  });

  it('should disallow a string with a   symbol at the end', () => {
    const stringContainer = new StringContainer('Some untrimmed string ');

    return validator.validate(stringContainer).then((errors) => {
      expect(errors[0]?.target).toEqual(stringContainer);
      expect(errors[0]?.value).toEqual('Some untrimmed string ');
      expect(errors[0]?.property).toEqual('name');
      expect(errors[0]?.constraints).toEqual({
        [CustomDecoratorsName.IsTrimmedString]: 'name must be a trimmed string',
      });
    });
  });

  it('should allow a empty string value', () => {
    const stringContainer = new StringContainer('');

    return validator.validate(stringContainer).then((errors) => {
      expect(errors.length).toEqual(0);
    });
  });

  it('should disallow a non-string value', () => {
    const stringContainer = new StringContainer(101010 as unknown as string);

    return validator.validate(stringContainer).then((errors) => {
      expect(errors[0]?.target).toEqual(stringContainer);
      expect(errors[0]?.value).toEqual(101010);
      expect(errors[0]?.property).toEqual('name');
      expect(errors[0]?.constraints).toEqual({
        [CustomDecoratorsName.IsTrimmedString]: 'name must be a trimmed string',
      });
    });
  });
});
