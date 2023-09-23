import 'reflect-metadata';
import 'dotenv/config';

export default async () => {
  await new Promise((resolve) => {
    setTimeout(() => resolve(undefined), 500);
  });

  return 42;
};

export const foobarProcessorPath = import.meta.url;
