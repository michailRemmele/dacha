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
});

test.afterEach(async () => {
  await closeApp({ app, window });
});

test('undo/redo an actor creation in the explorer', async () => {
  await clickTreeNode(window, 'space-level');
  await window.getByTitle('Add New Actor').click();
  await expect(treeNodesWithExactText(window, 'Actor')).toHaveCount(1);

  await window.evaluate(() => globalThis.window.electron.triggerUndo());
  await expect(treeNodesWithExactText(window, 'Actor')).toHaveCount(0);

  await window.evaluate(() => globalThis.window.electron.triggerRedo());
  await expect(treeNodesWithExactText(window, 'Actor')).toHaveCount(1);
});
