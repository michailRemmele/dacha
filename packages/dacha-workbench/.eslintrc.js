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
  'no-param-reassign': 0,
  'no-restricted-syntax': 0,
  'no-restricted-properties': 1,
  'prefer-destructuring': 'warn',
  semi: ['error', 'never'],
  'import/no-extraneous-dependencies': 0,
  'import/no-dynamic-require': 0,
  'global-require': 0,
  'no-continue': 0,
}

const reactRules = {
  'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
  'react/require-default-props': 0,
  'react/jsx-props-no-spreading': 0,
  'react/no-unused-class-component-methods': 0,
  'react-hooks/exhaustive-deps': 0,
  'react/prop-types': 0,
  'jsx-a11y/label-has-associated-control': 0,
  'react/react-in-jsx-scope': 0,
  'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
}

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
    ecmaVersion: 9,
    ecmaFeatures: {
      impliedStrict: true,
    },
    sourceType: 'module',
    requireConfigFile: false,
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
        ...reactRules,
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
