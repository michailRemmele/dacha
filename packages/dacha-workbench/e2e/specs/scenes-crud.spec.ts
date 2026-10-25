import { test, expect } from '../fixtures';

test.beforeEach(async ({ editor }) => {
  await editor.explorer.expand('space-level');
});

test('creating a new scene adds it to the tree', async ({ editor }) => {
  await editor.explorer.addScene();

  await expect(editor.explorer.nodes('Scene')).toHaveCount(1);
});

test('deleting an actor removes it from the tree', async ({ editor }) => {
  const { explorer } = editor;
  await explorer.addActor('space-level');

  await explorer.select('Actor');
  await explorer.delete();

  await expect(explorer.nodes('Actor')).toHaveCount(0);
});

test('multi-select deletes multiple actors at once', async ({ editor }) => {
  const { explorer } = editor;
  await explorer.addActor('space-level');
  await explorer.addActor('space-level', 'Actor 2');

  await explorer.select('Actor');
  await explorer.select('Actor 2', { add: true });
  await explorer.delete();

  await expect(explorer.nodes('Actor')).toHaveCount(0);
  await expect(explorer.nodes('Actor 2')).toHaveCount(0);
});

test('copy and paste duplicates an actor within the same scene', async ({
  editor,
}) => {
  const { explorer } = editor;
  await explorer.addActor('space-level');

  await explorer.select('Actor');
  await explorer.copy();
  await explorer.select('space-level');
  await explorer.paste();

  await expect(explorer.nodes('Actor')).toHaveCount(1);
  await expect(explorer.nodes('Actor 2')).toHaveCount(1);
});

test('cut and paste moves an actor to a different scene', async ({
  editor,
}) => {
  const { explorer } = editor;
  await explorer.addActor('space-level');

  await explorer.select('Actor');
  await explorer.cut();
  await explorer.open('island-level');
  await explorer.paste();

  await explorer.collapse('space-level');
  await expect(explorer.nodes('Actor')).toHaveCount(1);
});

test('undo/redo an actor creation in the explorer', async ({ editor }) => {
  const { explorer } = editor;
  await explorer.addActor('space-level');

  await editor.undo();
  await expect(explorer.nodes('Actor')).toHaveCount(0);

  await editor.redo();
  await expect(explorer.nodes('Actor')).toHaveCount(1);
});

test('screenshot: shown scene after deleting actors from two scenes at once', async ({
  editor,
}) => {
  const { explorer } = editor;
  await explorer.expand('island-level');
  await explorer.select('background_1');
  await explorer.select('player', { add: true });

  await explorer.delete();
  await expect(explorer.nodes('background_1')).toHaveCount(0);
  await expect(explorer.nodes('player')).toHaveCount(0);

  await expect(editor.canvas.root).toHaveScreenshot(
    'scenes-deleted-from-two-scenes.png',
  );
});
