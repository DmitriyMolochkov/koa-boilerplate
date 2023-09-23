import type { JestConfigWithTsJest } from 'ts-jest';

const jestSpecConfig: JestConfigWithTsJest = {
  testEnvironment: 'node',
  verbose: true,
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.spec.json',
      },
    ],
  },
  testMatch: [
    '**/?(*.)+(spec).[jt]s?(x)',
  ],
};

export default jestSpecConfig;
