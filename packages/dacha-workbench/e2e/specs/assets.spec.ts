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

const selectAsset = async (name: string, group = 'Texture'): Promise<void> => {
  await switchExplorerTab(window, 'Assets');
  if (!(await treeNodesWithExactText(window, name).isVisible())) {
    await toggleSceneExpand(window, group);
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

test('the sprite texture picker filters assets by name', async () => {
  const panel = await openPlayerSprite();

  await panel.locator('.ant-select').first().click();
  await window.keyboard.type('FLO');

  await expect(window.getByTitle('floor', { exact: true })).toBeVisible();
  await expect(window.getByTitle('grass', { exact: true })).toHaveCount(0);

  await window.keyboard.press('Enter');
  await expect(panel.locator('.ant-select').first()).toContainText('floor');
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

const textureImage = (): Locator => window.getByTestId('texture-preview-image');

const selectTextureFilter = async (filter: string): Promise<void> => {
  await window.getByTestId('inspector').locator('.ant-select').first().click();
  await window.getByTitle(filter, { exact: true }).click();
};

test('a texture asset shows a preview with the image size', async () => {
  await selectAsset('human');

  await expect(window.getByTestId('texture-preview-size')).toHaveText(
    '26 × 26 px',
  );
});

test('the texture preview follows the filter field and undo', async () => {
  await selectAsset('human');
  await expect(textureImage()).toHaveCSS('image-rendering', 'pixelated');

  await selectTextureFilter('linear');
  await expect(textureImage()).toHaveCSS('image-rendering', 'auto');

  await window.getByTestId('inspector').click({ position: { x: 5, y: 5 } });
  await undo();
  await expect(textureImage()).toHaveCSS('image-rendering', 'pixelated');
});

test('a texture asset with a missing file shows the error state', async () => {
  await selectAsset('human');
  const src = window.getByRole('textbox', { name: 'Src' });
  await src.fill('assets/missing.png');
  await src.press('Enter');

  await expect(window.getByTestId('asset-preview-error')).toBeVisible();
});

test('an audio asset shows a player with the duration', async () => {
  await selectAsset('bite', 'Audio');

  await expect(window.getByTestId('audio-player-current-time')).toHaveText(
    '0:00.0',
  );
  await expect(window.getByTestId('audio-player-duration')).toHaveText(
    '0:00.1',
  );
});

test('a bitmap font asset renders a sample', async () => {
  await selectAsset('monocraft', 'Bitmap Font');

  await expect(
    window.getByTestId('bitmap-font-canvas').locator('canvas'),
  ).toBeAttached();
  await expect(window.getByTestId('asset-preview-error')).toHaveCount(0);
});

test('screenshot: texture asset preview', async () => {
  await selectAsset('human');
  await expect(window.getByTestId('texture-preview-size')).toBeVisible();

  await expect(window.getByTestId('inspector')).toHaveScreenshot(
    'assets-texture-preview.png',
  );
});

test('screenshot: bitmap font asset preview', async () => {
  await selectAsset('monocraft', 'Bitmap Font');
  await expect(
    window.getByTestId('bitmap-font-canvas').locator('canvas'),
  ).toBeAttached();

  await expect(window.getByTestId('inspector')).toHaveScreenshot(
    'assets-bitmap-font-preview.png',
  );
});
