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

const addComponent = async (name: string): Promise<void> => {
  await window.getByRole('combobox').last().fill(name);
  await window.getByRole('combobox').last().press('Enter');
  await window.getByTestId('entity-picker-add-button').last().click();
  await expect(window.getByTestId(`entity-panel-${name}-header`)).toBeVisible();
};

test('a project behavior can be added to an actor and shows its options', async () => {
  await toggleSceneExpand(window, 'space-level');
  await clickTreeNode(window, 'background_1');
  await addComponent('Behaviors');

  const panel = window.getByTestId('entity-panel-Behaviors');
  await panel.getByRole('combobox').fill('Wobble');
  await panel.getByRole('combobox').press('Enter');
  await panel.getByTestId('entity-picker-add-button').click();

  await expect(panel.getByText('Amplitude', { exact: true })).toBeVisible();
});

test('a project shader can be chosen on a mesh and shows its options', async () => {
  await toggleSceneExpand(window, 'space-level');
  await clickTreeNode(window, 'background_1');
  await addComponent('Mesh');

  const panel = window.getByTestId('entity-panel-Mesh');
  await panel.getByText('Material', { exact: true }).first().click();
  await panel.getByRole('combobox').last().click();
  await window.getByTitle('Ripple').click();

  await expect(panel.getByText('Frequency', { exact: true })).toBeVisible();
});

test('a project filter effect can be added to the renderer and shows its options', async () => {
  await window.getByRole('tab', { name: 'Systems' }).click();
  const panel = window.getByTestId('entity-panel-Renderer');
  await window.getByTestId('entity-panel-Renderer-header').click();

  await expect(panel.getByText('Filter Effects')).toBeVisible();
  await panel.getByRole('combobox').last().fill('Tint');
  await panel.getByRole('combobox').last().press('Enter');
  await panel.getByTestId('entity-picker-add-button').click();

  await expect(panel.getByText('Color', { exact: true })).toBeVisible();
});
