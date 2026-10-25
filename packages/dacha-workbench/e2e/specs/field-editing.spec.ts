import { test, expect } from '../fixtures';

test.beforeEach(async ({ editor }) => {
  await editor.explorer.expand('space-level');
  await editor.explorer.select('background_1');
});

test('renaming an actor updates the explorer tree', async ({ editor }) => {
  const nameInput = editor.window.getByRole('textbox', { name: 'Name' });
  await nameInput.fill('renamed_background');
  await nameInput.blur();

  await expect(editor.explorer.nodes('renamed_background')).toHaveCount(1);
  await expect(editor.explorer.nodes('background_1')).toHaveCount(0);
});

test('editing a Transform field supports undo/redo', async ({ editor }) => {
  await editor.inspector.header('Transform').click();

  const rotationInput = editor.window.getByRole('spinbutton', {
    name: 'Rotation',
  });
  await rotationInput.fill('45');
  await rotationInput.blur();
  await expect(rotationInput).toHaveValue('45');

  await editor.undo();
  await expect(rotationInput).not.toHaveValue('45');

  await editor.redo();
  await expect(rotationInput).toHaveValue('45');
});
