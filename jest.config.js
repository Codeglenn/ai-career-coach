const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^lucide-react$': '<rootDir>/__mocks__/lucide-react.js',
    '^@dmitryrechkin/json-schema-to-zod$': '<rootDir>/__mocks__/json-schema-to-zod.js',
    '^next/server$': '<rootDir>/__mocks__/next-server.js',
    '^next/navigation$': '<rootDir>/__mocks__/next-navigation.js',
    '^react-markdown$': '<rootDir>/__mocks__/react-markdown.js',
    '^pkce-challenge$': '<rootDir>/__mocks__/pkce-challenge.js',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(lucide-react|@dmitryrechkin|react-markdown|pkce-challenge|@modelcontextprotocol|@modelcontextprotocol/sdk|@inngest|@langchain|@langchain/core|@langchain/community)/)'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/__tests__/e2e/', '<rootDir>/__tests__/integration/', '<rootDir>/__tests__/unit/components/ResumeUploadDialog.test.tsx', '<rootDir>/__tests__/unit/components/AiToolCard.test.tsx'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'inngest/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);

