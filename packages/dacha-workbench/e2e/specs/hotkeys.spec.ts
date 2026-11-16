import { test, expect } from '../fixtures';

test.beforeEach(async ({ editor }) => {
  await editor.explorer.expand('space-level');
});

test('the Edit menu Copy and Paste commands duplicate an actor', async ({
  editor,
}) => {
  const { explorer } = editor;
  await explorer.addActor('space-level');

  await explorer.select('Actor');
  await editor.clickMenuItem('Edit', 'Copy');
  await explorer.select('space-level');
  await editor.clickMenuItem('Edit', 'Paste');

  await expect(explorer.nodes('Actor')).toHaveCount(1);
  await expect(explorer.nodes('Actor 2')).toHaveCount(1);
});

test('the Edit menu Paste command inserts the system clipboard text into a focused field', async ({
  editor,
}) => {
  await editor.explorer.select('background_1');
  await editor.writeClipboard('pasted_name');

  const nameInput = editor.window.getByRole('textbox', { name: 'Name' });
  await nameInput.fill('');
  await editor.clickMenuItem('Edit', 'Paste');

  await expect(nameInput).toHaveValue('pasted_name');
});
