import { test, expect } from '@playwright/test';
import type { ElectronApplication, Page } from '@playwright/test';

import { launchApp, closeApp } from '../launch-app';
import {
  toggleSceneExpand,
  clickTreeNode,
  treeNodesWithExactText,
  MULTI_SELECT_MODIFIER,
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

test('creating a new actor adds it to the tree', async () => {
  await clickTreeNode(window, 'space-level');
  await window.getByTitle('Add New Actor').click();

  await expect(treeNodesWithExactText(window, 'Actor')).toHaveCount(1);
});

test('creating a new scene adds it to the tree', async () => {
  await window.getByTitle('Add New Scene').click();

  await expect(treeNodesWithExactText(window, 'Scene')).toHaveCount(1);
});

test('deleting an actor removes it from the tree', async () => {
  await clickTreeNode(window, 'space-level');
  await window.getByTitle('Add New Actor').click();
  await expect(treeNodesWithExactText(window, 'Actor')).toHaveCount(1);

  await clickTreeNode(window, 'Actor', { exact: true });
  await window.getByTitle('Delete').click();

  await expect(treeNodesWithExactText(window, 'Actor')).toHaveCount(0);
});

test('multi-select deletes multiple actors at once', async () => {
  await clickTreeNode(window, 'space-level');
  await window.getByTitle('Add New Actor').click();
  await clickTreeNode(window, 'space-level');
  await window.getByTitle('Add New Actor').click();

  await expect(treeNodesWithExactText(window, 'Actor')).toHaveCount(1);
  await expect(treeNodesWithExactText(window, 'Actor 2')).toHaveCount(1);

  await clickTreeNode(window, 'Actor', { exact: true });
  await clickTreeNode(window, 'Actor 2', {
    exact: true,
    modifiers: [MULTI_SELECT_MODIFIER],
  });
  await window.getByTitle('Delete').click();

  await expect(treeNodesWithExactText(window, 'Actor')).toHaveCount(0);
  await expect(treeNodesWithExactText(window, 'Actor 2')).toHaveCount(0);
});

test('copy and paste duplicates an actor within the same scene', async () => {
  await clickTreeNode(window, 'space-level');
  await window.getByTitle('Add New Actor').click();
  await expect(treeNodesWithExactText(window, 'Actor')).toHaveCount(1);

  await clickTreeNode(window, 'Actor', { exact: true });
  await window.getByTitle('Copy', { exact: true }).click();
  await clickTreeNode(window, 'space-level');
  await window.getByTitle('Paste').click();

  await expect(treeNodesWithExactText(window, 'Actor')).toHaveCount(1);
  await expect(treeNodesWithExactText(window, 'Actor 2')).toHaveCount(1);
});

test('cut and paste moves an actor to a different scene', async () => {
  await clickTreeNode(window, 'space-level');
  await window.getByTitle('Add New Actor').click();
  await expect(treeNodesWithExactText(window, 'Actor')).toHaveCount(1);

  await clickTreeNode(window, 'Actor', { exact: true });
  await window.getByTitle('Cut').click();
  await toggleSceneExpand(window, 'island-level');
  await clickTreeNode(window, 'island-level');
  await window.getByTitle('Paste').click();

  await toggleSceneExpand(window, 'space-level');
  await expect(treeNodesWithExactText(window, 'Actor')).toHaveCount(1);
});
