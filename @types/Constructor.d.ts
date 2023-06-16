// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type Constructor<T = object, Args extends any[] = any[]> = new (...args: Args) => T;
