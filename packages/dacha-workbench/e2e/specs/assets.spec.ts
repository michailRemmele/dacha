import { test, expect } from '../fixtures';
import type { Locator } from '@playwright/test';
import type { Editor } from '../pages/editor';

const selectAsset = async (
  { explorer }: Editor,
  name: string,
  group = 'Texture',
): Promise<void> => {
  await explorer.openTab('Assets');
  await explorer.expand(group);
  await explorer.select(name);
};

const openPlayerSprite = async ({
  explorer,
  inspector,
}: Editor): Promise<Locator> => {
  await explorer.expand('island-level');
  await explorer.select('player');
  return inspector.expand('Sprite');
};

const editHumanSrc = async (editor: Editor): Promise<Locator> => {
  await selectAsset(editor, 'human');
  const src = editor.window.getByRole('textbox', { name: 'Src' });
  await expect(src).toHaveValue('assets/units/human.png');
  await src.fill('assets/terrain/floor.png');
  await src.press('Enter');
  await src.blur();
  return src;
};

const deleteHumanAndMask = async (editor: Editor): Promise<void> => {
  const { explorer } = editor;
  await selectAsset(editor, 'human');
  await explorer.select('mask', { add: true });
  await explorer.delete();
  await expect(explorer.nodes('human')).toHaveCount(0);
  await expect(explorer.nodes('mask')).toHaveCount(0);
};

test('a sprite shows its texture asset and switches to another one', async ({
  editor,
}) => {
  const panel = await openPlayerSprite(editor);
  const textureSelect = panel.locator('.ant-select').first();

  await expect(textureSelect).toContainText('human');

  await editor.inspector.choose(textureSelect, 'floor');

  await expect(textureSelect).toContainText('floor');
});

test('the sprite texture picker filters assets by name', async ({ editor }) => {
  const { window } = editor;
  const panel = await openPlayerSprite(editor);

  await panel.locator('.ant-select').first().click();
  await window.keyboard.type('FLO');

  await expect(window.getByTitle('floor', { exact: true })).toBeVisible();
  await expect(window.getByTitle('grass', { exact: true })).toHaveCount(0);

  await window.keyboard.press('Enter');
  await expect(panel.locator('.ant-select').first()).toContainText('floor');
});

test('undo reverts an edit of a texture asset', async ({ editor }) => {
  const src = await editHumanSrc(editor);
  await expect(src).toHaveValue('assets/terrain/floor.png');

  await editor.undo();

  await expect(src).toHaveValue('assets/units/human.png');
});

test('deleting texture assets in use keeps the editor working', async ({
  editor,
}) => {
  const { explorer, inspector } = editor;
  const errors = editor.collectErrors();
  await explorer.open('island-level');

  await deleteHumanAndMask(editor);
  await explorer.openTab('Scenes');
  await explorer.select('player');

  await expect(inspector.panel('Sprite')).toBeVisible();
  expect(errors).toEqual([]);
});

test('a new texture asset is offered in the sprite texture picker', async ({
  editor,
}) => {
  const { explorer, window } = editor;
  await explorer.openTab('Assets');
  await explorer.addAsset('Texture');

  await explorer.openTab('Scenes');
  const panel = await openPlayerSprite(editor);
  await panel.locator('.ant-select').first().click();

  await expect(window.getByTitle('texture', { exact: true })).toBeVisible();
});

test('screenshot: scene after a texture asset is edited, and after undo', async ({
  editor,
}) => {
  await editor.explorer.open('island-level');
  await editHumanSrc(editor);

  await expect(editor.canvas.root).toHaveScreenshot(
    'assets-texture-edited.png',
  );

  await editor.undo();

  await expect(editor.canvas.root).toHaveScreenshot('assets-island-level.png');
});

test('screenshot: scene after texture assets in use are deleted', async ({
  editor,
}) => {
  await editor.explorer.open('island-level');
  await deleteHumanAndMask(editor);

  await expect(editor.canvas.root).toHaveScreenshot('assets-deleted.png');
});

test('a texture asset shows a preview with the image size', async ({
  editor,
}) => {
  await selectAsset(editor, 'human');

  await expect(editor.window.getByTestId('texture-preview-size')).toHaveText(
    '26 × 26 px',
  );
});

test('the texture preview follows the filter field and undo', async ({
  editor,
}) => {
  const { inspector, window } = editor;
  const image = window.getByTestId('texture-preview-image');

  await selectAsset(editor, 'human');
  await expect(image).toHaveCSS('image-rendering', 'pixelated');

  await inspector.choose(
    inspector.root.locator('.ant-select').first(),
    'linear',
  );
  await expect(image).toHaveCSS('image-rendering', 'auto');

  await inspector.root.click({ position: { x: 5, y: 5 } });
  await editor.undo();
  await expect(image).toHaveCSS('image-rendering', 'pixelated');
});

test('a texture asset with a missing file shows the error state', async ({
  editor,
}) => {
  await selectAsset(editor, 'human');
  const src = editor.window.getByRole('textbox', { name: 'Src' });
  await src.fill('assets/missing.png');
  await src.press('Enter');

  await expect(editor.window.getByTestId('asset-preview-error')).toBeVisible();
});

test('an audio asset shows a player with the duration', async ({ editor }) => {
  await selectAsset(editor, 'bite', 'Audio');

  await expect(
    editor.window.getByTestId('audio-player-current-time'),
  ).toHaveText('0:00.0');
  await expect(editor.window.getByTestId('audio-player-duration')).toHaveText(
    '0:00.1',
  );
});

test('a bitmap font asset renders a sample', async ({ editor }) => {
  await selectAsset(editor, 'monocraft', 'Bitmap Font');

  await expect(
    editor.window.getByTestId('bitmap-font-canvas').locator('canvas'),
  ).toBeAttached();
  await expect(editor.window.getByTestId('asset-preview-error')).toHaveCount(0);
});

test('screenshot: texture asset preview', async ({ editor }) => {
  await selectAsset(editor, 'human');
  await expect(editor.window.getByTestId('texture-preview-size')).toBeVisible();

  await expect(editor.inspector.root).toHaveScreenshot(
    'assets-texture-preview.png',
  );
});

test('screenshot: bitmap font asset preview', async ({ editor }) => {
  await selectAsset(editor, 'monocraft', 'Bitmap Font');
  await expect(
    editor.window.getByTestId('bitmap-font-canvas').locator('canvas'),
  ).toBeAttached();

  await expect(editor.inspector.root).toHaveScreenshot(
    'assets-bitmap-font-preview.png',
  );
});
