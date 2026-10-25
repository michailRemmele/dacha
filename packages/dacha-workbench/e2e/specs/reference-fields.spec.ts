import { test, expect } from '../fixtures';

test.beforeEach(async ({ editor }) => {
  await editor.explorer.expand('space-level');
  await editor.explorer.select('background_1');
  await editor.inspector.addComponent('Spawner');
});

test('a template field picks a root template and undoes the pick', async ({
  editor,
}) => {
  const panel = editor.inspector.panel('Spawner');
  const prefab = panel.getByRole('combobox').first();

  await editor.inspector.pick(prefab, 'player');
  await expect(panel.getByTitle('player', { exact: true })).toBeVisible();

  await editor.undo();
  await expect(panel.getByTitle('player', { exact: true })).toHaveCount(0);
});

test('a scene list keeps the order of adds, and undo removes the last one', async ({
  editor,
}) => {
  const panel = editor.inspector.panel('Spawner');
  const add = panel.getByRole('combobox').last();

  await editor.inspector.pick(add, 'menu');
  await editor.inspector.pick(add, 'island-level');

  const rows = panel.getByTestId('reference-entry-delete');
  await expect(rows).toHaveCount(2);

  await expect(panel.locator('.ant-select-content-has-value')).toHaveText([
    '[none]',
    'menu',
    'island-level',
  ]);

  await editor.undo();
  await expect(rows).toHaveCount(1);
});
