import { test, expect } from '../fixtures';

test.beforeEach(async ({ editor }) => {
  await editor.explorer.expand('space-level');
});

test('a project component opens on add with its fields at their initial values', async ({
  editor,
}) => {
  await editor.explorer.select('background_1');

  const panel = await editor.inspector.addComponent('Health');

  await expect(panel.getByRole('spinbutton', { name: /^Points/ })).toHaveValue(
    '100',
  );
  await expect(
    panel.getByRole('checkbox', { name: 'Regenerates' }),
  ).not.toBeChecked();
});

test('a section shows only while one of its fields does', async ({
  editor,
}) => {
  await editor.explorer.select('background_1');

  const panel = await editor.inspector.addComponent('Health');
  const regenerates = panel.getByRole('checkbox', { name: 'Regenerates' });
  const section = panel.getByText('Regeneration', { exact: true });

  await expect(regenerates).toBeVisible();
  await expect(section).toBeHidden();

  await regenerates.check();
  await expect(section).toBeVisible();

  await section.click();
  await expect(
    panel.getByRole('spinbutton', { name: /^Regeneration Rate/ }),
  ).toHaveValue('5');

  await regenerates.uncheck();
  await expect(section).toBeHidden();
});

test('an added component opens and stays open for its type across actors', async ({
  editor,
}) => {
  const { explorer, inspector } = editor;
  const spriteTexture = inspector
    .panel('Sprite')
    .getByRole('button', { name: 'Texture' });
  const transformField = inspector
    .panel('Transform')
    .getByRole('spinbutton')
    .first();

  await explorer.select('background_1');
  await inspector.addComponent('Sprite');

  await expect(spriteTexture).toBeVisible();
  await expect(transformField).toBeHidden();

  await explorer.select('player_1');

  await expect(inspector.header('Keyboard Control')).toBeVisible();
  await expect(
    editor.window.getByRole('button', { name: 'Add New Bind' }),
  ).toBeHidden();

  await explorer.select('background_1');

  await expect(spriteTexture).toBeVisible();
  await expect(transformField).toBeHidden();
});

test('adding an existing component to a template', async ({ editor }) => {
  await editor.explorer.openTab('Templates');
  await editor.explorer.select('terrain');

  await editor.inspector.addComponent('Collider');
});

test('screenshot: schema mismatch', async ({ editor }) => {
  const { explorer, inspector } = editor;
  await explorer.expand('component-schema-test');
  await explorer.select('schema_test_actor');

  await expect(inspector.header('Transform')).toBeVisible();
  await expect(inspector.header('Legacy Component')).toBeVisible();

  await expect(inspector.root).toHaveScreenshot('schema-mismatch.png');
});
