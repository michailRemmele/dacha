const commonRules = {
  'class-methods-use-this': 0,
  'no-underscore-dangle': 0,
  'lines-between-class-members': 0,
  'import/prefer-default-export': 0,
  'no-void': 0,
  'import/extensions': [
    'error',
    'ignorePackages',
    {
      js: 'never',
      ts: 'never',
    },
  ],
  'no-param-reassign': 1,
  'no-restricted-properties': 1,
};

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 9,
    ecmaFeatures: {
      impliedStrict: true,
    },
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
      parser: '@typescript-eslint/parser',
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
        '@typescript-eslint/lines-between-class-members': 0,
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
