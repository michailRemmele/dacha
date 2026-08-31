import { test, expect } from '@playwright/test';
import type { ElectronApplication, Page } from '@playwright/test';

import { launchApp, closeApp } from '../launch-app';
import {
  toggleSceneExpand,
  clickTreeNode,
  treeNodesWithExactText,
} from '../helpers';

let app: ElectronApplication;
let window: Page;

test.beforeEach(async () => {
  ({ app, window } = await launchApp());
  await toggleSceneExpand(window, 'space-level');
  await clickTreeNode(window, 'background_1');
});

test.afterEach(async () => {
  await closeApp({ app, window });
});

test('renaming an actor updates the explorer tree', async () => {
  const nameInput = window.getByRole('textbox', { name: 'Name' });
  await nameInput.fill('renamed_background');
  await nameInput.blur();

  await expect(
    treeNodesWithExactText(window, 'renamed_background'),
  ).toHaveCount(1);
  await expect(treeNodesWithExactText(window, 'background_1')).toHaveCount(0);
});

test('editing a Transform field supports undo/redo', async () => {
  await window.getByTestId('entity-panel-Transform-header').click();

  const rotationInput = window.getByRole('spinbutton', { name: 'Rotation' });
  await rotationInput.fill('45');
  await rotationInput.blur();
  await expect(rotationInput).toHaveValue('45');

  await window.evaluate(() => globalThis.window.electron.triggerUndo());
  await expect(rotationInput).not.toHaveValue('45');

  await window.evaluate(() => globalThis.window.electron.triggerRedo());
  await expect(rotationInput).toHaveValue('45');
});
