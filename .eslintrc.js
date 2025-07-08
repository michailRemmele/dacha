const commonRules = {
  'class-methods-use-this': 0,
  'no-underscore-dangle': 0,
  'lines-between-class-members': 0,
  'import/prefer-default-export': 0,
  'no-void': 0,
  'arrow-body-style': 0,
  'import/extensions': [
    'error',
    'ignorePackages',
    {
      js: 'never',
      ts: 'never',
    },
  ],
  'no-bitwise': 0,
  'no-continue': 0,
  'no-restricted-syntax': 0,
  'no-param-reassign': 0,
  'no-restricted-properties': 1,
  'prefer-destructuring': 'warn',
  'prefer-exponentiation-operator': 'warn',
  'no-console': ['error', { allow: ['warn', 'error'] }],
};

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  globals: {
    window: true,
  },
  rules: {
    ...commonRules,
  },
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
      extends: [
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        ...commonRules,
        '@typescript-eslint/no-this-alias': 0,
        '@typescript-eslint/lines-between-class-members': 0,
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/no-loop-func': 0,
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
