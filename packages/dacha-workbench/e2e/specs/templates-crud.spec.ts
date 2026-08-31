import { test, expect } from '@playwright/test';
import type { ElectronApplication, Page } from '@playwright/test';

import { launchApp, closeApp } from '../launch-app';
import {
  switchExplorerTab,
  clickTreeNode,
  treeNodesWithExactText,
} from '../helpers';

let app: ElectronApplication;
let window: Page;

test.beforeEach(async () => {
  ({ app, window } = await launchApp());
  await switchExplorerTab(window, 'Templates');
});

test.afterEach(async () => {
  await closeApp({ app, window });
});

test('creating a new template adds it to the tree', async () => {
  await window.getByTitle('Add New Template').click();

  await expect(treeNodesWithExactText(window, 'Template')).toHaveCount(1);
});

test('deleting a template removes it from the tree', async () => {
  await window.getByTitle('Add New Template').click();
  await expect(treeNodesWithExactText(window, 'Template')).toHaveCount(1);

  await clickTreeNode(window, 'Template', { exact: true });
  await window.getByTitle('Delete').click();

  await expect(treeNodesWithExactText(window, 'Template')).toHaveCount(0);
});
