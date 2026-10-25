import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

const MULTI_SELECT_MODIFIER =
  process.platform === 'darwin' ? 'Meta' : 'Control';

type ExplorerTab = 'Scenes' | 'Templates' | 'Assets';

interface SelectOptions {
  /** Adds the node to the selection instead of replacing it. */
  add?: boolean;
}

/**
 * The explorer panel: the scenes, templates and assets trees and their toolbar.
 * Nodes are found by their exact title.
 */
export class Explorer {
  constructor(private readonly window: Page) {}

  async openTab(name: ExplorerTab): Promise<void> {
    await this.window.getByRole('tab', { name }).click();
  }

  /** The tree nodes titled exactly `title`. */
  nodes(title: string): Locator {
    return this.window
      .getByTestId('explorer-tree-node')
      .filter({ has: this.window.getByText(title, { exact: true }) });
  }

  /** The titles of the selected nodes. */
  selectedNodes(): Locator {
    return this.window.locator(
      '[data-testid="explorer-tree-node-title"][data-selected="true"]',
    );
  }

  async expand(title: string): Promise<void> {
    await this.setExpanded(title, true);
  }

  async collapse(title: string): Promise<void> {
    await this.setExpanded(title, false);
  }

  async select(
    title: string,
    { add = false }: SelectOptions = {},
  ): Promise<void> {
    const node = this.nodes(title);
    await node.click({ modifiers: add ? [MULTI_SELECT_MODIFIER] : [] });

    if (!add) {
      await expect(
        node.getByTestId('explorer-tree-node-title'),
      ).toHaveAttribute('data-selected', 'true');
    }
  }

  /** Expands the node and selects it. */
  async open(title: string): Promise<void> {
    await this.expand(title);
    await this.select(title);
  }

  /** Adds an actor to the scene and waits for it in the tree. */
  async addActor(scene: string, name = 'Actor'): Promise<void> {
    await this.select(scene);
    await this.window.getByTitle('Add New Actor').click();
    await expect(this.nodes(name)).toHaveCount(1);
  }

  async addScene(): Promise<void> {
    await this.window.getByTitle('Add New Scene').click();
  }

  async addTemplate(): Promise<void> {
    await this.window.getByTitle('Add New Template').click();
  }

  async addAsset(kind: string): Promise<void> {
    await this.window.getByTitle('Add New Asset').click();
    await this.window.getByRole('menuitem', { name: kind }).click();
  }

  async copy(): Promise<void> {
    await this.window.getByTitle('Copy', { exact: true }).click();
  }

  async cut(): Promise<void> {
    await this.window.getByTitle('Cut').click();
  }

  async paste(): Promise<void> {
    await this.window.getByTitle('Paste').click();
  }

  async delete(): Promise<void> {
    await this.window.getByTitle('Delete').click();
  }

  private async setExpanded(title: string, expanded: boolean): Promise<void> {
    const switcher = this.nodes(title).locator('.ant-tree-switcher');
    const isOpen = await switcher.evaluate((element) =>
      element.classList.contains('ant-tree-switcher_open'),
    );
    if (isOpen !== expanded) {
      await switcher.click();
    }
  }
}
