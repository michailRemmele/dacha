import { test, expect } from '@playwright/test';
import type { ElectronApplication, Page } from '@playwright/test';

import { launchApp, closeApp } from '../launch-app';
import { toggleSceneExpand, clickTreeNode } from '../helpers';

let app: ElectronApplication;
let window: Page;

test.beforeEach(async () => {
  ({ app, window } = await launchApp());
});

test.afterEach(async () => {
  await closeApp({ app, window });
});

test('selecting an actor shows its component widgets in the inspector', async () => {
  await toggleSceneExpand(window, 'space-level');
  await clickTreeNode(window, 'background_1');

  await expect(window.getByTestId('entity-panel-Transform-header')).toBeVisible();
});

test('component widget expands and collapses on header click', async () => {
  await toggleSceneExpand(window, 'space-level');
  await clickTreeNode(window, 'background_1');

  const header = window.getByTestId('entity-panel-Transform-header');
  const panel = window.getByTestId('entity-panel-Transform');

  await header.click();
  await expect(panel).toHaveClass(/ant-collapse-item-active/);

  await header.click();
  await expect(panel).not.toHaveClass(/ant-collapse-item-active/);
});

test('screenshot: inspector widget expanded', async () => {
  await toggleSceneExpand(window, 'space-level');
  await clickTreeNode(window, 'background_1');

  await window.getByTestId('entity-panel-Transform-header').click();

  await expect(window).toHaveScreenshot('inspector-widget-expanded.png');
});

test('inspector tabs switch between Systems and Project settings', async () => {
  await window.getByRole('tab', { name: 'Systems' }).click();
  await expect(window.getByText('Add System')).toBeVisible();

  await window.getByRole('tab', { name: 'Project settings' }).click();
  await expect(window.getByText('Global Options')).toBeVisible();
});
