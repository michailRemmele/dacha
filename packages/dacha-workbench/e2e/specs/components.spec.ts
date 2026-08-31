import { test, expect } from '@playwright/test';
import type { ElectronApplication, Page } from '@playwright/test';

import { launchApp, closeApp } from '../launch-app';
import {
  toggleSceneExpand,
  clickTreeNode,
  switchExplorerTab,
} from '../helpers';

let app: ElectronApplication;
let window: Page;

test.beforeEach(async () => {
  ({ app, window } = await launchApp());
});

test.afterEach(async () => {
  await closeApp({ app, window });
});

test('adding an existing component to an actor', async () => {
  await toggleSceneExpand(window, 'space-level');
  await clickTreeNode(window, 'background_1');

  await window.getByRole('combobox').click();
  await window.getByText('Sprite', { exact: true }).click();
  await window.getByTestId('entity-picker-add-button').click();

  await expect(window.getByTestId('entity-panel-Sprite-header')).toBeVisible();
});

test('adding an existing component to a template', async () => {
  await switchExplorerTab(window, 'Templates');
  await clickTreeNode(window, 'terrain');

  await window.getByRole('combobox').click();
  await window.getByText('Collider', { exact: true }).click();
  await window.getByTestId('entity-picker-add-button').click();

  await expect(window.getByTestId('entity-panel-Collider-header')).toBeVisible();
});

test('screenshot: create new component modal', async () => {
  await toggleSceneExpand(window, 'space-level');
  await clickTreeNode(window, 'background_1');

  await window.getByRole('combobox').click();
  await window.getByRole('button', { name: 'Create New' }).click();

  await expect(
    window.getByRole('dialog', { name: 'New Component' }),
  ).toBeVisible();
  await expect(window).toHaveScreenshot('create-new-component-modal.png');
});

test('screenshot: schema mismatch', async () => {
  await toggleSceneExpand(window, 'component-schema-test');
  await clickTreeNode(window, 'schema_test_actor');

  await expect(window.getByTestId('entity-panel-Transform-header')).toBeVisible();

  await expect(
    window.getByTestId('entity-panel-Legacy Component-header'),
  ).toBeVisible();
  await expect(window).toHaveScreenshot('schema-mismatch.png');
});
