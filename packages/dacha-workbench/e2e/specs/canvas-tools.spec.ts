import { test, expect } from '@playwright/test';
import type { ElectronApplication, Page } from '@playwright/test';

import { launchApp, closeApp } from '../launch-app';
import {
  selectScene,
  selectTool,
  getCanvasBox,
  readCache,
  treeNodesWithExactText,
  CACHE_SAVE_DEBOUNCE,
} from '../helpers';

let app: ElectronApplication;
let window: Page;

const SCENE = 'space-level';

test.beforeEach(async () => {
  ({ app, window } = await launchApp());
  await selectScene(window, SCENE);
});

test.afterEach(async () => {
  await closeApp({ app, window });
});

const clickCanvasCenter = async (): Promise<void> => {
  const box = await getCanvasBox(window);
  await window.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
};

const selectedTreeNode = (): ReturnType<Page['locator']> =>
  window.locator(
    '[data-testid="explorer-tree-node-title"][data-selected="true"]',
  );

test('pointer tool selects an actor on canvas and reflects it in explorer and inspector', async () => {
  await selectTool(window, 'pointer');
  await clickCanvasCenter();

  await expect(selectedTreeNode()).toHaveText('terrain_1');
  await expect(window.getByTestId('entity-panel-Transform')).toBeVisible();
});

test('pointer tool rubber-band selects every enclosed actor', async () => {
  const box = await getCanvasBox(window);
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  await selectTool(window, 'zoom');
  await window.getByTestId('zoom-direction-out').click();
  await window.mouse.click(cx, cy);
  await window.mouse.click(cx, cy);
  await window.mouse.click(cx, cy);
  await window.waitForTimeout(CACHE_SAVE_DEBOUNCE * 2);

  await selectTool(window, 'pointer');
  await window.mouse.move(box.x + box.width * 0.08, box.y + box.height * 0.08);
  await window.mouse.down();
  await window.mouse.move(box.x + box.width * 0.92, box.y + box.height * 0.92, {
    steps: 15,
  });
  await window.mouse.up();

  await expect(selectedTreeNode()).toHaveText([
    'background_1',
    'terrain_1',
    'player_1',
  ]);
});

test('zoom tool in mode zooms the camera in', async () => {
  await selectTool(window, 'zoom');
  const box = await getCanvasBox(window);

  await window.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await window.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await window.waitForTimeout(CACHE_SAVE_DEBOUNCE * 2);

  const cache = await readCache(window);
  expect(cache['canvas.mainActor.camera.zoom']).toBeGreaterThan(1);
});

test('zoom tool out mode zooms the camera back out', async () => {
  await selectTool(window, 'zoom');
  const box = await getCanvasBox(window);
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  await window.mouse.click(cx, cy);
  await window.mouse.click(cx, cy);
  await window.waitForTimeout(CACHE_SAVE_DEBOUNCE * 2);
  const zoomedIn = (await readCache(window))[
    'canvas.mainActor.camera.zoom'
  ] as number;

  await window.getByTestId('zoom-direction-out').click();
  await window.mouse.click(cx, cy);
  await window.mouse.click(cx, cy);
  await window.waitForTimeout(CACHE_SAVE_DEBOUNCE * 2);
  const zoomedOut = (await readCache(window))[
    'canvas.mainActor.camera.zoom'
  ] as number;

  expect(zoomedOut).toBeLessThan(zoomedIn);
});

test('hand tool pans the camera while dragging', async () => {
  await selectTool(window, 'hand');
  const box = await getCanvasBox(window);

  await window.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await window.mouse.down();
  await window.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.3, {
    steps: 10,
  });
  await window.mouse.up();
  await window.waitForTimeout(CACHE_SAVE_DEBOUNCE * 2);

  const cache = await readCache(window);
  expect(cache['canvas.mainActor.transform.offsetX']).not.toBe(0);
  expect(cache['canvas.mainActor.transform.offsetY']).not.toBe(0);
});

test('template tool creates an actor in the selected scene on canvas click', async () => {
  await selectTool(window, 'template');

  await window.getByTestId('template-tool-select').click();
  await window.keyboard.type('player');
  await window.keyboard.press('Enter');
  await expect(window.getByTestId('template-tool-select')).toContainText(
    'player',
  );

  await expect(treeNodesWithExactText(window, 'player')).toHaveCount(0);

  await clickCanvasCenter();

  await expect(treeNodesWithExactText(window, 'player')).toHaveCount(1);
});

test('enabling the grid in settings changes what the canvas renders', async () => {
  const canvas = window.locator('#canvas-root');
  const before = await canvas.screenshot();

  await window.evaluate(() => globalThis.window.electron.openSettings('grid'));
  await expect(window.getByRole('dialog', { name: 'Settings' })).toBeVisible();
  await window.getByTestId('settings-show-grid').click();
  await window.keyboard.press('Escape');
  await expect(window.getByRole('dialog', { name: 'Settings' })).toBeHidden();
  await window.waitForTimeout(CACHE_SAVE_DEBOUNCE * 2);

  const after = await canvas.screenshot();

  expect(before.equals(after)).toBe(false);
  const cache = await readCache(window);
  expect(cache['canvas.mainActor.settings.showGrid']).toBe(true);
});
