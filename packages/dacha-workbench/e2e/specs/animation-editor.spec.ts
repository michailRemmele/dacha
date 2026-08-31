import { test, expect } from '@playwright/test';
import type { ElectronApplication, Page } from '@playwright/test';

import { launchApp, closeApp } from '../launch-app';
import { switchExplorerTab, clickTreeNode } from '../helpers';

let app: ElectronApplication;
let window: Page;

test.beforeEach(async () => {
  ({ app, window } = await launchApp());
});

test.afterEach(async () => {
  await closeApp({ app, window });
});

const openAnimationEditor = async (window: Page): Promise<void> => {
  await switchExplorerTab(window, 'Templates');
  await clickTreeNode(window, 'player');

  await window.getByTestId('entity-panel-Animatable-header').click();
  await window.getByRole('button', { name: 'Open Animation Editor' }).click();
};

test('opening the animation editor from the Animatable widget', async () => {
  await openAnimationEditor(window);

  await expect(
    window.getByRole('dialog', { name: 'Animation Editor' }),
  ).toBeVisible();
});

test('screenshot: animation editor open', async () => {
  await openAnimationEditor(window);

  await expect(
    window.getByRole('dialog', { name: 'Animation Editor' }),
  ).toBeVisible();
  await expect(window).toHaveScreenshot('animation-editor-open.png');
});
