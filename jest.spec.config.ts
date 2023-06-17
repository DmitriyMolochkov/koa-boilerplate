import type { JestConfigWithTsJest } from 'ts-jest';

const jestSpecConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.spec.json',
      },
    ],

  },
  testMatch: [
    '**/?(*.)+(spec).[jt]s?(x)',
  ],
};

export default jestSpecConfig;
