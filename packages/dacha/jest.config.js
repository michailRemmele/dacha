module.exports = {
  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^pixi\\.js$': '<rootDir>/jest/pixi-stub.cjs',
  },
};
