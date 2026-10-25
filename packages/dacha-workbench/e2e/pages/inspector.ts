import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

type InspectorTab = 'Systems' | 'Project settings';

/**
 * The inspector panel. A component, system or script is shown in an entity panel,
 * found by its title.
 */
export class Inspector {
  readonly root: Locator;

  constructor(private readonly window: Page) {
    this.root = window.getByTestId('inspector');
  }

  async openTab(name: InspectorTab): Promise<void> {
    await this.window.getByRole('tab', { name }).click();
  }

  panel(title: string): Locator {
    return this.window.getByTestId(`entity-panel-${title}`);
  }

  header(title: string): Locator {
    return this.window.getByTestId(`entity-panel-${title}-header`);
  }

  /** Opens a collapsed panel. */
  async expand(title: string): Promise<Locator> {
    const panel = this.panel(title);
    await this.header(title).click();
    await expect(panel).toHaveClass(/ant-collapse-item-active/);
    return panel;
  }

  /** Adds a component with the picker at the bottom of the inspector. */
  async addComponent(name: string): Promise<Locator> {
    await this.addWithPicker(this.window, name);
    await expect(this.header(name)).toBeVisible();
    return this.panel(name);
  }

  /** Adds a script, such as a behavior or a filter effect, with the picker in `panel`. */
  async addScript(panel: Locator, name: string): Promise<void> {
    await this.addWithPicker(panel, name);
  }

  /** Types `text` into a select, takes the first match and leaves the select. */
  async pick(select: Locator, text: string): Promise<void> {
    await select.fill(text);
    await select.press('Enter');
    await select.blur();
  }

  /** Opens a select and clicks the option titled `option`. */
  async choose(select: Locator, option: string): Promise<void> {
    await select.click();
    await this.window.getByTitle(option, { exact: true }).click();
  }

  private async addWithPicker(
    scope: Page | Locator,
    name: string,
  ): Promise<void> {
    // Picking an option adds it.
    const picker = scope.getByRole('combobox').last();
    await picker.fill(name);
    await picker.press('Enter');
  }
}
