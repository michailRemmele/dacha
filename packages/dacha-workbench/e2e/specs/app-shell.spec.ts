import { test, expect } from '@playwright/test';
import type { ElectronApplication, Page } from '@playwright/test';

import { launchApp, closeApp } from '../launch-app';

let app: ElectronApplication;
let window: Page;

test.beforeEach(async () => {
  ({ app, window } = await launchApp());
});

test.afterEach(async () => {
  await closeApp({ app, window });
});

test('main panels render on boot', async () => {
  await expect(window.locator('#canvas-root')).toBeVisible();
  await expect(window.getByTitle('Pointer Tool')).toBeVisible();
  await expect(window.getByRole('tab', { name: 'Scenes' })).toBeVisible();
  await expect(window.getByRole('tab', { name: 'Inspector' })).toBeVisible();
});

test('screenshot: main panels', async () => {
  await expect(window.locator('#canvas-root')).toBeVisible();
  await expect(window).toHaveScreenshot('app-shell.png');
});

test('screenshot: settings modal', async () => {
  await expect(window.getByRole('tab', { name: 'Scenes' })).toBeVisible();

  await window.evaluate(() => globalThis.window.electron.openSettings('grid'));

  await expect(window.getByRole('dialog', { name: 'Settings' })).toBeVisible();
  await expect(window).toHaveScreenshot('settings-modal.png');
});
