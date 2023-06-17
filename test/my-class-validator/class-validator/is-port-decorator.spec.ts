import {
  IS_INT,
  IsPort,
  MAX,
  MIN,
  Validator,
} from '#class-validator';

const validator = new Validator();

describe('IsPort decorator', () => {
  class PortContainer {
    @IsPort()
    public port: number;

    constructor(port: number) {
      this.port = port;
    }
  }

  it('should allow a number 8080', () => {
    const portContainer = new PortContainer(8080);

    return validator.validate(portContainer).then((errors) => {
      expect(errors.length).toEqual(0);
    });
  });

  it('should disallow a string \'8080\'', () => {
    const portContainer = new PortContainer('8080' as unknown as number);

    return validator.validate(portContainer).then((errors) => {
      expect(errors[0]?.target).toEqual(portContainer);
      expect(errors[0]?.value).toEqual('8080');
      expect(errors[0]?.property).toEqual('port');
      expect(errors[0]?.constraints).toEqual({
        [IS_INT]: 'port must be an integer number',
        [MAX]: 'port must not be greater than 65535',
        [MIN]: 'port must not be less than 0',
      });
    });
  });

  it('should disallow numbers greater than 65535', () => {
    const portContainer = new PortContainer(65536);

    return validator.validate(portContainer).then((errors) => {
      expect(errors[0]?.target).toEqual(portContainer);
      expect(errors[0]?.value).toEqual(65536);
      expect(errors[0]?.property).toEqual('port');
      expect(errors[0]?.constraints).toEqual({
        [MAX]: 'port must not be greater than 65535',
      });
    });
  });

  it('should disallow numbers less than 0', () => {
    const portContainer = new PortContainer(-1);

    return validator.validate(portContainer).then((errors) => {
      expect(errors[0]?.target).toEqual(portContainer);
      expect(errors[0]?.value).toEqual(-1);
      expect(errors[0]?.property).toEqual('port');
      expect(errors[0]?.constraints).toEqual({
        [MIN]: 'port must not be less than 0',
      });
    });
  });

  it('should disallow Infinity', () => {
    const portContainer = new PortContainer(Infinity);

    return validator.validate(portContainer).then((errors) => {
      expect(errors[0]?.target).toEqual(portContainer);
      expect(errors[0]?.value).toEqual(Infinity);
      expect(errors[0]?.property).toEqual('port');
      expect(errors[0]?.constraints).toEqual({
        [IS_INT]: 'port must be an integer number',
        [MAX]: 'port must not be greater than 65535',
      });
    });
  });

  it('should disallow NaN', () => {
    const portContainer = new PortContainer(NaN);

    return validator.validate(portContainer).then((errors) => {
      expect(errors[0]?.target).toEqual(portContainer);
      expect(errors[0]?.value).toEqual(NaN);
      expect(errors[0]?.property).toEqual('port');
      expect(errors[0]?.constraints).toEqual({
        [IS_INT]: 'port must be an integer number',
        [MAX]: 'port must not be greater than 65535',
        [MIN]: 'port must not be less than 0',
      });
    });
  });
});
