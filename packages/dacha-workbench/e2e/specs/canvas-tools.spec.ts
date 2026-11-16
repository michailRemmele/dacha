import { test, expect } from '../fixtures';

test.beforeEach(async ({ editor }) => {
  await editor.explorer.open('space-level');
});

test('pointer tool selects an actor on canvas and reflects it in explorer and inspector', async ({
  editor,
}) => {
  await editor.canvas.selectTool('pointer');
  await editor.canvas.click();

  await expect(editor.explorer.selectedNodes()).toHaveText('terrain_1');
  await expect(editor.inspector.panel('Transform')).toBeVisible();
});

test('pointer tool rubber-band selects every enclosed actor', async ({
  editor,
}) => {
  const { canvas } = editor;

  await canvas.selectTool('zoom');
  await canvas.zoomOutMode();
  await canvas.click({ times: 3 });
  await editor.waitForCacheSave();

  await canvas.selectTool('pointer');
  await canvas.drag([0.08, 0.08], [0.92, 0.92], 15);

  await expect(editor.explorer.selectedNodes()).toHaveText([
    'background_1',
    'terrain_1',
    'player_1',
  ]);
});

test('zoom tool zooms the camera in, then back out', async ({ editor }) => {
  const { canvas } = editor;
  const readZoom = async (): Promise<number> =>
    (await editor.readCache())['canvas.mainActor.camera.zoom'] as number;

  await canvas.selectTool('zoom');
  await canvas.click({ times: 2 });
  await editor.waitForCacheSave();
  const zoomedIn = await readZoom();
  expect(zoomedIn).toBeGreaterThan(1);

  await canvas.zoomOutMode();
  await canvas.click({ times: 2 });
  await editor.waitForCacheSave();

  expect(await readZoom()).toBeLessThan(zoomedIn);
});

test('hand tool pans the camera while dragging', async ({ editor }) => {
  await editor.canvas.selectTool('hand');
  await editor.canvas.drag([0.5, 0.5], [0.2, 0.3]);
  await editor.waitForCacheSave();

  const cache = await editor.readCache();
  expect(cache['canvas.mainActor.transform.offsetX']).not.toBe(0);
  expect(cache['canvas.mainActor.transform.offsetY']).not.toBe(0);
});

test('template tool creates an actor in the selected scene on canvas click', async ({
  editor,
}) => {
  const { canvas, explorer } = editor;
  await canvas.selectTool('template');

  const select = await canvas.chooseTemplate('player');
  await expect(select).toContainText('player');

  await expect(explorer.nodes('player')).toHaveCount(0);

  await canvas.click();

  await expect(explorer.nodes('player')).toHaveCount(1);
});

test('enabling the grid in settings changes what the canvas renders', async ({
  editor,
}) => {
  const before = await editor.canvas.root.screenshot();

  const dialog = await editor.openSettings('grid');
  await expect(dialog).toBeVisible();
  await editor.window.getByTestId('settings-show-grid').click();
  await editor.window.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await editor.waitForCacheSave();

  const after = await editor.canvas.root.screenshot();

  expect(before.equals(after)).toBe(false);
  const cache = await editor.readCache();
  expect(cache['canvas.mainActor.settings.showGrid']).toBe(true);
});
