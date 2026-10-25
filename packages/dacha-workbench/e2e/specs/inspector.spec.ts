import { test, expect } from '../fixtures';

test('component widget expands and collapses on header click', async ({
  editor,
}) => {
  const { explorer, inspector } = editor;
  await explorer.expand('space-level');
  await explorer.select('background_1');

  const header = inspector.header('Transform');
  const panel = inspector.panel('Transform');

  await header.click();
  await expect(panel).toHaveClass(/ant-collapse-item-active/);

  await header.click();
  await expect(panel).not.toHaveClass(/ant-collapse-item-active/);
});

test('screenshot: inspector widget expanded', async ({ editor }) => {
  const { explorer, inspector } = editor;
  await explorer.expand('space-level');
  await explorer.select('background_1');

  await inspector.expand('Transform');

  await expect(inspector.root).toHaveScreenshot(
    'inspector-widget-expanded.png',
  );
});

test('inspector tabs switch between Systems and Project settings', async ({
  editor,
}) => {
  await editor.inspector.openTab('Systems');
  await expect(editor.window.getByText('Add System')).toBeVisible();

  await editor.inspector.openTab('Project settings');
  await expect(editor.window.getByText('Global Options')).toBeVisible();
});
