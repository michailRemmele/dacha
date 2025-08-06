// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
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
      'import/no-unresolved': 0,
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-empty-function': 0,
      '@typescript-eslint/no-empty-object-type': 0,
      '@typescript-eslint/no-this-alias': 0,
      '@typescript-eslint/no-extraneous-class': 0,
      '@typescript-eslint/no-dynamic-delete': 0,
      '@typescript-eslint/no-non-null-assertion': 0,
    },
  },
  {
    ignores: [
      'build',
      'build-app',
      'esm',
      'public',
      'fixture',
      'jest.config.js',
      'eslint.config.mjs',
      'webpack.config.js',
      'webpack.extension.config.js',
      'bin',
      'electron',
      'index.js',
      'preload.js',
      'FixJSDOMEnvironment.js',
    ],
  },
  eslintConfigPrettier,
);
