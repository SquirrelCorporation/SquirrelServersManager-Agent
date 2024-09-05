module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/tests/unit/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Adjust based on your alias setup
  },

  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
