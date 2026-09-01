import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './specs',
  timeout: 60_000,
  workers: 1,
  retries: 0,
  reporter: [['html', { outputFolder: '../playwright-report', open: 'never' }]],
  outputDir: '../test-results',
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: isCI ? 0.001 : 0.02,
    },
  },
});
