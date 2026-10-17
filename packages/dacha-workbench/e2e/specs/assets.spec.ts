import { test, expect } from '@playwright/test';
import type { ElectronApplication, Page, Locator } from '@playwright/test';

import { launchApp, closeApp } from '../launch-app';
import {
  toggleSceneExpand,
  clickTreeNode,
  selectScene,
  switchExplorerTab,
  treeNodesWithExactText,
  MULTI_SELECT_MODIFIER,
  collectPageErrors,
} from '../helpers';

let app: ElectronApplication;
let window: Page;

test.beforeEach(async () => {
  ({ app, window } = await launchApp());
});

test.afterEach(async () => {
  await closeApp({ app, window });
});

const selectAsset = async (name: string): Promise<void> => {
  await switchExplorerTab(window, 'Assets');
  if (!(await treeNodesWithExactText(window, name).isVisible())) {
    await toggleSceneExpand(window, 'Texture');
  }
  await clickTreeNode(window, name, { exact: true });
};

const openPlayerSprite = async (): Promise<ReturnType<Page['getByTestId']>> => {
  await toggleSceneExpand(window, 'island-level');
  await clickTreeNode(window, 'player');

  const panel = window.getByTestId('entity-panel-Sprite');
  await window.getByTestId('entity-panel-Sprite-header').click();
  await expect(panel).toHaveClass(/ant-collapse-item-active/);

  return panel;
};

test('a sprite shows its texture asset and switches to another one', async () => {
  const panel = await openPlayerSprite();
  const textureSelect = panel.locator('.ant-select').first();

  await expect(textureSelect).toContainText('human');

  await textureSelect.click();
  await window.getByTitle('floor', { exact: true }).click();

  await expect(textureSelect).toContainText('floor');
});

const editHumanSrc = async (): Promise<Locator> => {
  await selectAsset('human');
  const src = window.getByRole('textbox', { name: 'Src' });
  await expect(src).toHaveValue('assets/units/human.png');
  await src.fill('assets/terrain/floor.png');
  await src.press('Enter');
  await src.blur();
  return src;
};

const deleteHumanAndMask = async (): Promise<void> => {
  await selectAsset('human');
  await clickTreeNode(window, 'mask', {
    exact: true,
    modifiers: [MULTI_SELECT_MODIFIER],
  });
  await window.getByTitle('Delete').click();
  await expect(treeNodesWithExactText(window, 'human')).toHaveCount(0);
  await expect(treeNodesWithExactText(window, 'mask')).toHaveCount(0);
};

const undo = (): Promise<void> =>
  window.evaluate(() => globalThis.window.electron.triggerUndo());

test('undo reverts an edit of a texture asset', async () => {
  const src = await editHumanSrc();
  await expect(src).toHaveValue('assets/terrain/floor.png');

  await undo();

  await expect(src).toHaveValue('assets/units/human.png');
});

test('deleting texture assets in use keeps the editor working', async () => {
  const errors = collectPageErrors(window);
  await selectScene(window, 'island-level');

  await deleteHumanAndMask();
  await switchExplorerTab(window, 'Scenes');
  await clickTreeNode(window, 'player');

  await expect(window.getByTestId('entity-panel-Sprite')).toBeVisible();
  expect(errors).toEqual([]);
});

test('a new texture asset is offered in the sprite texture picker', async () => {
  await switchExplorerTab(window, 'Assets');
  await window.getByTitle('Add New Asset').click();
  await window.getByRole('menuitem', { name: 'Texture' }).click();

  await switchExplorerTab(window, 'Scenes');
  const panel = await openPlayerSprite();
  await panel.locator('.ant-select').first().click();

  await expect(window.getByTitle('texture', { exact: true })).toBeVisible();
});

test('screenshot: scene after a texture asset is edited, and after undo', async () => {
  await selectScene(window, 'island-level');
  await editHumanSrc();

  await expect(window.locator('#canvas-root')).toHaveScreenshot(
    'assets-texture-edited.png',
  );

  await undo();

  await expect(window.locator('#canvas-root')).toHaveScreenshot(
    'assets-island-level.png',
  );
});

test('screenshot: scene after texture assets in use are deleted', async () => {
  await selectScene(window, 'island-level');
  await deleteHumanAndMask();

  await expect(window.locator('#canvas-root')).toHaveScreenshot(
    'assets-deleted.png',
  );
});
