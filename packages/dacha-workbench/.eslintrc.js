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
      tsx: 'never',
    },
  ],
  'no-param-reassign': 1,
  'no-restricted-properties': 1,
  'prefer-destructuring': 'warn',
  semi: ['error', 'never'],
  'import/no-extraneous-dependencies': 0,
}

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@babel/eslint-parser',
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
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: './tsconfig.json',
      },
      extends: [
        'airbnb',
        'airbnb/hooks',
        'airbnb-typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        ...commonRules,
        '@typescript-eslint/lines-between-class-members': 0,
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/semi': 0,
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.tsx'],
      },
    },
  },
}
