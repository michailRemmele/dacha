import { test, expect } from '../fixtures';

test('screenshot: main panels', async ({ editor }) => {
  await expect(editor.canvas.root).toBeVisible();
  await expect(editor.window).toHaveScreenshot('app-shell.png');
});

test('screenshot: settings modal', async ({ editor }) => {
  await expect(
    editor.window.getByRole('tab', { name: 'Scenes' }),
  ).toBeVisible();

  const dialog = await editor.openSettings('grid');

  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveScreenshot('settings-modal.png');
});
