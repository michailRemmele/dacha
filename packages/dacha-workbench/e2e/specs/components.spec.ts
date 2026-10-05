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

  await window.getByRole('combobox').fill('Sprite');
  await window.getByRole('combobox').press('Enter');
  await window.getByTestId('entity-picker-add-button').click();

  await expect(window.getByTestId('entity-panel-Sprite-header')).toBeVisible();
});

test('a project component opens on add with its fields at their initial values', async () => {
  await toggleSceneExpand(window, 'space-level');
  await clickTreeNode(window, 'background_1');

  await window.getByRole('combobox').fill('Health');
  await window.getByRole('combobox').press('Enter');
  await window.getByTestId('entity-picker-add-button').click();

  await expect(window.getByTestId('entity-panel-Health-header')).toBeVisible();

  const panel = window.getByTestId('entity-panel-Health');
  await expect(panel.getByRole('spinbutton', { name: /^Points/ })).toHaveValue(
    '100',
  );
  await expect(
    panel.getByRole('checkbox', { name: 'Regenerates' }),
  ).not.toBeChecked();
});

test('a section shows only while one of its fields does', async () => {
  await toggleSceneExpand(window, 'space-level');
  await clickTreeNode(window, 'background_1');

  await window.getByRole('combobox').fill('Health');
  await window.getByRole('combobox').press('Enter');
  await window.getByTestId('entity-picker-add-button').click();

  const panel = window.getByTestId('entity-panel-Health');
  await expect(
    panel.getByRole('checkbox', { name: 'Regenerates' }),
  ).toBeVisible();
  await expect(panel.getByText('Regeneration', { exact: true })).toBeHidden();

  await panel.getByRole('checkbox', { name: 'Regenerates' }).check();
  await expect(panel.getByText('Regeneration', { exact: true })).toBeVisible();

  await panel.getByText('Regeneration', { exact: true }).click();
  await expect(
    panel.getByRole('spinbutton', { name: /^Regeneration Rate/ }),
  ).toHaveValue('5');

  await panel.getByRole('checkbox', { name: 'Regenerates' }).uncheck();
  await expect(panel.getByText('Regeneration', { exact: true })).toBeHidden();
});

test('an added component opens and stays open for its type across actors', async () => {
  await toggleSceneExpand(window, 'space-level');
  await clickTreeNode(window, 'background_1');

  await window.getByRole('combobox').fill('Sprite');
  await window.getByRole('combobox').press('Enter');
  await window.getByTestId('entity-picker-add-button').click();

  await expect(
    window.getByTestId('entity-panel-Sprite').getByText('Texture'),
  ).toBeVisible();
  await expect(
    window
      .getByTestId('entity-panel-Transform')
      .getByRole('spinbutton')
      .first(),
  ).toBeHidden();

  await clickTreeNode(window, 'player_1');

  await expect(
    window.getByTestId('entity-panel-Keyboard Control-header'),
  ).toBeVisible();
  await expect(
    window.getByRole('button', { name: 'Add New Bind' }),
  ).toBeHidden();

  await clickTreeNode(window, 'background_1');

  await expect(
    window.getByTestId('entity-panel-Sprite').getByText('Texture'),
  ).toBeVisible();
  await expect(
    window
      .getByTestId('entity-panel-Transform')
      .getByRole('spinbutton')
      .first(),
  ).toBeHidden();
});

test('adding an existing component to a template', async () => {
  await switchExplorerTab(window, 'Templates');
  await clickTreeNode(window, 'terrain');

  await window.getByRole('combobox').fill('Collider');
  await window.getByRole('combobox').press('Enter');
  await window.getByTestId('entity-picker-add-button').click();

  await expect(
    window.getByTestId('entity-panel-Collider-header'),
  ).toBeVisible();
});

test('screenshot: create new component modal', async () => {
  await toggleSceneExpand(window, 'space-level');
  await clickTreeNode(window, 'background_1');

  await window.getByRole('combobox').click();
  await window.getByRole('button', { name: 'Create New' }).click();

  const dialog = window.getByRole('dialog', { name: 'New Component' });
  await expect(dialog).toBeVisible();

  await expect(window).toHaveScreenshot('create-new-component-modal.png', {
    mask: [
      dialog.getByText(/^File Path:/),
      dialog.getByRole('textbox', { name: 'Base Directory' }),
    ],
  });
});

test('screenshot: schema mismatch', async () => {
  await toggleSceneExpand(window, 'component-schema-test');
  await clickTreeNode(window, 'schema_test_actor');

  await expect(
    window.getByTestId('entity-panel-Transform-header'),
  ).toBeVisible();

  await expect(
    window.getByTestId('entity-panel-Legacy Component-header'),
  ).toBeVisible();
  await expect(window).toHaveScreenshot('schema-mismatch.png');
});
