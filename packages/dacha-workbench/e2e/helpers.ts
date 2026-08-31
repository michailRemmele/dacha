import type { Page, Locator } from '@playwright/test';

export const MULTI_SELECT_MODIFIER: 'Meta' | 'Control' =
  process.platform === 'darwin' ? 'Meta' : 'Control';

export const switchExplorerTab = async (
  window: Page,
  tabName: 'Scenes' | 'Templates' | 'Assets',
): Promise<void> => {
  await window.getByRole('tab', { name: tabName }).click();
};

const TREE_NODE_SELECTOR = '[data-testid="explorer-tree-node"]';

export const toggleSceneExpand = async (
  window: Page,
  sceneName: string,
): Promise<void> => {
  await window
    .locator(TREE_NODE_SELECTOR, { hasText: sceneName })
    .locator('.ant-tree-switcher')
    .click();
};

interface ClickTreeNodeOptions {
  exact?: boolean;
  modifiers?: ('Meta' | 'Control' | 'Shift')[];
}

export const clickTreeNode = async (
  window: Page,
  text: string,
  options: ClickTreeNodeOptions = {},
): Promise<void> => {
  const locator = options.exact
    ? window
        .locator(TREE_NODE_SELECTOR)
        .filter({ has: window.getByText(text, { exact: true }) })
    : window.locator(TREE_NODE_SELECTOR, { hasText: text });

  await locator.click({ modifiers: options.modifiers });
};

export const treeNodesWithExactText = (window: Page, text: string): Locator =>
  window
    .locator(TREE_NODE_SELECTOR)
    .filter({ has: window.getByText(text, { exact: true }) });
