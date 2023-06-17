// eslint-disable-next-line max-classes-per-file
import {
  Contains,
  IsDefined,
  MinLength,
  ValidateNested,
  ValidatePromise,
  ValidationTypes,
  Validator,
} from '#class-validator';

const validator = new Validator();

// You can find the source code of tests at: https://github.com/typestack/class-validator/blob/develop/test/functional/promise-validation.spec.ts
describe('promise validation', () => {
  it('should not validate missing nested objects', () => {
    expect.assertions(4);

    class MySubClass {
      @MinLength(5)
      public name!: string;
    }

    class MyClass {
      @Contains('hello')
      public title!: string;

      @ValidatePromise()
      @ValidateNested()
      @IsDefined()
      public mySubClass!: Promise<MySubClass>;
    }

    const model: MyClass & { title: string | undefined } = new MyClass();
    model.title = 'helo';

    return validator.validate(model).then((errors) => {
      expect(errors[1]?.target).toEqual(model);
      expect(errors[1]?.value).toBeUndefined();
      expect(errors[1]?.property).toEqual('mySubClass');
      expect(errors[1]?.constraints).toEqual({ isDefined: 'mySubClass should not be null or undefined' });
    });
  });

  it('should validate nested objects', () => {
    expect.assertions(24);

    class MySubClass {
      @MinLength(5)
      public name!: string;
    }

    class MyClass {
      @Contains('hello')
      public title!: string;

      @ValidatePromise()
      @ValidateNested()
      public mySubClass!: Promise<MySubClass>;

      @ValidatePromise()
      @ValidateNested()
      public mySubClasses!: Promise<MySubClass[]>;
    }

    const model = new MyClass();
    model.title = 'helo world';
    const mySubClass = new MySubClass();
    mySubClass.name = 'my';
    model.mySubClass = Promise.resolve(mySubClass);
    const mySubClasses: [MySubClass, MySubClass] = [new MySubClass(), new MySubClass()];
    mySubClasses[0].name = 'my';
    mySubClasses[1].name = 'not-short';
    model.mySubClasses = Promise.resolve(mySubClasses);
    return validator.validate(model).then((errors) => {
      return Promise.all([model.mySubClass, model.mySubClasses])
        .then(([modelMySubClass, modelMySubClasses]) => {
          expect(errors.length).toEqual(3);

          expect(errors[0]?.target).toEqual(model);
          expect(errors[0]?.property).toEqual('title');
          expect(errors[0]?.constraints).toEqual({ contains: 'title must contain a hello string' });
          expect(errors[0]?.value).toEqual('helo world');

          expect(errors[1]?.target).toEqual(model);
          expect(errors[1]?.property).toEqual('mySubClass');
          expect(errors[1]?.value).toEqual(modelMySubClass);
          expect(errors[1]?.constraints).toBeUndefined();
          const subError1 = errors[1]?.children?.[0];
          expect(subError1?.target).toEqual(modelMySubClass);
          expect(subError1?.property).toEqual('name');
          expect(subError1?.constraints).toEqual({ minLength: 'name must be longer than or equal to 5 characters' });
          expect(subError1?.value).toEqual('my');

          expect(errors[2]?.target).toEqual(model);
          expect(errors[2]?.property).toEqual('mySubClasses');
          expect(errors[2]?.value).toEqual(modelMySubClasses);
          expect(errors[2]?.constraints).toBeUndefined();
          const subError2 = errors[2]?.children?.[0];
          expect(subError2?.target).toEqual(modelMySubClasses);
          expect(subError2?.value).toEqual(modelMySubClasses[0]);
          expect(subError2?.property).toEqual('0');
          const subSubError = subError2?.children?.[0];
          expect(subSubError?.target).toEqual(modelMySubClasses[0]);
          expect(subSubError?.property).toEqual('name');
          expect(subSubError?.constraints).toEqual({ minLength: 'name must be longer than or equal to 5 characters' });
          expect(subSubError?.value).toEqual('my');
        });
    });
  });

  it('should validate when nested is not object', () => {
    expect.assertions(4);

    class MySubClass {
      @MinLength(5)
      public name!: string;
    }

    class MyClass {
      @ValidatePromise()
      @ValidateNested()
      public mySubClass!: MySubClass;
    }

    const model = new MyClass();
    model.mySubClass = 'invalidnested object' as unknown as MySubClass;

    return validator.validate(model).then((errors) => {
      expect(errors[0]?.target).toEqual(model);
      expect(errors[0]?.property).toEqual('mySubClass');
      expect(errors[0]?.children?.length).toEqual(0);
      expect(errors[0]?.constraints).toEqual({
        [ValidationTypes.NESTED_VALIDATION]: 'nested property mySubClass must be either object or array',
      });
    });
  });

  it('should validate array promise', () => {
    expect.assertions(5);

    class MyClass {
      @ValidatePromise()
      @MinLength(2)
      public arrProperty!: Promise<string[]>;
    }

    const model = new MyClass();
    model.arrProperty = Promise.resolve(['one']);

    return validator.validate(model).then((errors) => {
      return Promise.all([model.arrProperty]).then(([modelArrProperty]) => {
        expect(errors.length).toEqual(1);

        expect(errors[0]?.target).toEqual(model);
        expect(errors[0]?.property).toEqual('arrProperty');
        expect(errors[0]?.constraints).toEqual({
          minLength: 'arrProperty must be longer than or equal to 2 characters',
        });
        expect(errors[0]?.value).toEqual(modelArrProperty);
      });
    });
  });
});
