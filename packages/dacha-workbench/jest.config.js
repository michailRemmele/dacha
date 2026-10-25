module.exports = {
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      { diagnostics: { exclude: ['**/packages/dacha/src/**'] } },
    ],
  },
  moduleNameMapper: {
    '\\.css$': '<rootDir>/css-module-stub.js',
  },
  testEnvironment: './FixJSDOMEnvironment.js',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/e2e/'],
};
