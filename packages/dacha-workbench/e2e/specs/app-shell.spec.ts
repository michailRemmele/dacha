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

test('screenshot: main panels', async () => {
  await expect(window.locator('#canvas-root')).toBeVisible();
  await expect(window).toHaveScreenshot('app-shell.png');
});

test('screenshot: settings modal', async () => {
  await expect(window.getByRole('tab', { name: 'Scenes' })).toBeVisible();

  await window.evaluate(() => globalThis.window.electron.openSettings('grid'));

  const dialog = window.getByRole('dialog', { name: 'Settings' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveScreenshot('settings-modal.png');
});
