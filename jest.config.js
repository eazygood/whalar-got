/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
    testMatch: ['<rootDir>/test/**/*.test.ts?(x)'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    verbose: true,
    maxWorkers: 4,
    testTimeout: 30000,
    cacheDirectory: '.jest-cache',
    globalSetup: "<rootDir>/test/test-env-setup.ts",
    globalTeardown: "<rootDir>/test/test-env-teardown.ts",
    // setupFilesAfterEnv: [
    //   './test/jest.setup.ts',
    //   './jest.mocks.js',
    // ],
    transform: {
      '^.+\\.ts$': ['ts-jest', { tsconfig: 'test/tsconfig.json' }],
    },
    coveragePathIgnorePatterns: [
      'node_modules',
    ],
};
