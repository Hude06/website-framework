import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      jsx: 'react-jsx',
    }],
  },
  moduleNameMapper: {
    '^@client/(.*)$': '<rootDir>/client/$1',
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss)$': '<rootDir>/__tests__/__mocks__/styleMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/.claude/', '__mocks__', 'setup.ts'],
  modulePathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/.claude/'],
};

export default config;
