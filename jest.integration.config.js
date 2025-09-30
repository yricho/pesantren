const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  displayName: 'Integration Tests',
  setupFilesAfterEnv: ['<rootDir>/jest.integration.setup.js'],
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/__tests__/integration/**/*.test.(js|jsx|ts|tsx)',
    '<rootDir>/src/**/__tests__/integration/**/*.test.(js|jsx|ts|tsx)'
  ],
  testTimeout: 10000,
  collectCoverageFrom: [
    'src/app/api/**/*.{js,ts}',
    'src/lib/**/*.{js,ts}',
    '!src/**/*.d.ts'
  ],
  coverageReporters: ['text', 'lcov'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
  }
}

module.exports = createJestConfig(customJestConfig)