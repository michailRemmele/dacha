import { test, expect } from '../fixtures';
import type { Editor } from '../pages/editor';

const openAnimationEditor = async ({
  explorer,
  inspector,
  window,
}: Editor): Promise<void> => {
  await explorer.openTab('Templates');
  await explorer.select('player');

  await inspector.header('Animatable').click();
  await window.getByRole('button', { name: 'Open Animation Editor' }).click();
};

test('opening the animation editor from the Animatable widget', async ({
  editor,
}) => {
  await openAnimationEditor(editor);

  await expect(
    editor.window.getByRole('dialog', { name: 'Animation Editor' }),
  ).toBeVisible();
});

test('screenshot: animation editor open', async ({ editor }) => {
  await openAnimationEditor(editor);

  const dialog = editor.window.getByRole('dialog', {
    name: 'Animation Editor',
  });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveScreenshot('animation-editor-open.png');
});
