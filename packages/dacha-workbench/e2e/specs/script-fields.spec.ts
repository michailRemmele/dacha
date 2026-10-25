import { test, expect } from '../fixtures';

test('a project behavior can be added to an actor and shows its options', async ({
  editor,
}) => {
  const { explorer, inspector } = editor;
  await explorer.expand('space-level');
  await explorer.select('background_1');

  const panel = await inspector.addComponent('Behaviors');
  await inspector.addScript(panel, 'Wobble');

  await expect(panel.getByText('Amplitude', { exact: true })).toBeVisible();
});

test('a project shader can be chosen on a mesh and shows its options', async ({
  editor,
}) => {
  const { explorer, inspector } = editor;
  await explorer.expand('space-level');
  await explorer.select('background_1');

  const panel = await inspector.addComponent('Mesh');
  await panel.getByText('Material', { exact: true }).first().click();
  await inspector.choose(panel.getByRole('combobox').last(), 'Ripple');

  await expect(panel.getByText('Frequency', { exact: true })).toBeVisible();
});

test('a project filter effect can be added to the renderer and shows its options', async ({
  editor,
}) => {
  const { inspector } = editor;
  await inspector.openTab('Systems');
  await inspector.header('Renderer').click();

  const panel = inspector.panel('Renderer');
  await expect(panel.getByText('Filter Effects')).toBeVisible();
  await inspector.addScript(panel, 'Tint');

  await expect(panel.getByText('Color', { exact: true })).toBeVisible();
});
