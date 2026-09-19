import { test, expect } from '@playwright/test';
import type { ElectronApplication, Page } from '@playwright/test';

import { launchApp, closeApp } from '../launch-app';
import {
  toggleSceneExpand,
  clickTreeNode,
  treeNodesWithExactText,
  triggerMenuItem,
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

test('the Edit menu Copy and Paste commands duplicate an actor', async () => {
  await clickTreeNode(window, 'space-level');
  await window.getByTitle('Add New Actor').click();
  await expect(treeNodesWithExactText(window, 'Actor')).toHaveCount(1);

  await clickTreeNode(window, 'Actor', { exact: true });
  await triggerMenuItem(app, 'Edit', 'Copy');
  await clickTreeNode(window, 'space-level');
  await triggerMenuItem(app, 'Edit', 'Paste');

  await expect(treeNodesWithExactText(window, 'Actor')).toHaveCount(1);
  await expect(treeNodesWithExactText(window, 'Actor 2')).toHaveCount(1);
});

test('the Edit menu Paste command inserts the system clipboard text into a focused field', async () => {
  await clickTreeNode(window, 'background_1');
  await app.evaluate(({ clipboard }) => clipboard.writeText('pasted_name'));

  const nameInput = window.getByRole('textbox', { name: 'Name' });
  await nameInput.fill('');
  await triggerMenuItem(app, 'Edit', 'Paste');

  await expect(nameInput).toHaveValue('pasted_name');
});
