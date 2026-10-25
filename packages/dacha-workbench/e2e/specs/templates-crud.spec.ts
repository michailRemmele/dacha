import { test, expect } from '../fixtures';

test.beforeEach(async ({ editor }) => {
  await editor.explorer.openTab('Templates');
});

test('deleting a template removes it from the tree', async ({ editor }) => {
  const { explorer } = editor;

  await explorer.addTemplate();
  await expect(explorer.nodes('Template')).toHaveCount(1);

  await explorer.select('Template');
  await explorer.delete();

  await expect(explorer.nodes('Template')).toHaveCount(0);
});

test('moving a template with instances keeps the editor working', async ({
  editor,
}) => {
  const { explorer } = editor;
  const errors = editor.collectErrors();
  // The scene view rebuilds the shown scene, so show the one with player_1, an
  // instance of the player template.
  await explorer.openTab('Scenes');
  await explorer.open('space-level');
  await explorer.openTab('Templates');

  await explorer.select('player');
  await explorer.cut();
  await explorer.select('terrain');
  await explorer.paste();

  await explorer.expand('terrain');
  await expect(explorer.nodes('player')).toHaveCount(1);

  await explorer.openTab('Scenes');
  await explorer.select('player_1');
  await expect(
    editor.window.getByRole('textbox', { name: 'Template' }),
  ).toHaveValue('player');
  expect(errors).toEqual([]);
});
