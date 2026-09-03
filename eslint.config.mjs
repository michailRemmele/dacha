// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import-x';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-empty-object-type': 0,
      '@typescript-eslint/no-this-alias': 0,
      '@typescript-eslint/no-extraneous-class': 0,
      '@typescript-eslint/no-dynamic-delete': 0,
      '@typescript-eslint/no-non-null-assertion': 0,
      'import-x/default': 0,
      'import-x/no-named-as-default-member': 0,
    },
  },
  {
    files: ['packages/dacha-workbench/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-empty-function': 0,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    ignores: [
      'docs',
      'packages/dacha-docs',
      'packs',
      'scripts',
      'eslint.config.mjs',
      'packages/dacha/build',
      'packages/dacha/docs',
      'packages/dacha/jest.config.js',
      'packages/dacha-workbench/build',
      'packages/dacha-workbench/build-app',
      'packages/dacha-workbench/esm',
      'packages/dacha-workbench/public',
      'packages/dacha-workbench/fixture',
      'packages/dacha-workbench/bin',
      'packages/dacha-workbench/electron',
      'packages/dacha-workbench/scripts',
      'packages/dacha-workbench/jest.config.js',
      'packages/dacha-workbench/webpack.base.js',
      'packages/dacha-workbench/webpack.config.js',
      'packages/dacha-workbench/webpack.extension.config.js',
      'packages/dacha-workbench/index.js',
      'packages/dacha-workbench/preload.js',
      'packages/dacha-workbench/FixJSDOMEnvironment.js',
      'packages/dacha-workbench/css-module-stub.js',
    ],
  },
  eslintConfigPrettier,
);
