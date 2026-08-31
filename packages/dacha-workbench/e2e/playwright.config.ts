import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  timeout: 60_000,
  workers: 1,
  retries: 0,
  reporter: [['html', { outputFolder: '../playwright-report', open: 'never' }]],
  outputDir: '../test-results',
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
    },
  },
});
