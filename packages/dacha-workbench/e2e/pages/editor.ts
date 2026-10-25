import type { ElectronApplication, Locator, Page } from '@playwright/test';

import type { LaunchedApp } from '../launch-app';

import { Canvas } from './canvas';
import { Explorer } from './explorer';
import { Inspector } from './inspector';

// The editor debounces writes of its persistent storage by this much.
const CACHE_SAVE_DEBOUNCE = 300;

/**
 * The running editor. Panels have their own page objects; `app` and `window` stay
 * public for steps no page object covers.
 */
export class Editor {
  readonly app: ElectronApplication;
  readonly window: Page;

  readonly explorer: Explorer;
  readonly inspector: Inspector;
  readonly canvas: Canvas;

  constructor({ app, window }: LaunchedApp) {
    this.app = app;
    this.window = window;

    this.explorer = new Explorer(window);
    this.inspector = new Inspector(window);
    this.canvas = new Canvas(window);
  }

  async undo(): Promise<void> {
    await this.window.evaluate(() => globalThis.window.electron.triggerUndo());
  }

  async redo(): Promise<void> {
    await this.window.evaluate(() => globalThis.window.electron.triggerRedo());
  }

  /** Clicks an item of the application menu, as the user would from the menu bar. */
  async clickMenuItem(menuLabel: string, itemLabel: string): Promise<void> {
    await this.app.evaluate(
      ({ Menu, BrowserWindow }, labels) => {
        const submenu = Menu.getApplicationMenu()?.items.find(
          (item) => item.label === labels.menuLabel,
        )?.submenu;
        const target = submenu?.items.find(
          (item) => item.label === labels.itemLabel,
        );

        if (!target) {
          throw new Error(
            `No "${labels.itemLabel}" item in the "${labels.menuLabel}" menu`,
          );
        }

        const [win] = BrowserWindow.getAllWindows();
        target.click(undefined, win);
      },
      { menuLabel, itemLabel },
    );
  }

  async writeClipboard(text: string): Promise<void> {
    await this.app.evaluate(
      ({ clipboard }, value) => clipboard.writeText(value),
      text,
    );
  }

  /** Opens the settings modal on a tab. */
  async openSettings(tab: string): Promise<Locator> {
    await this.window.evaluate(
      (name) => globalThis.window.electron.openSettings(name),
      tab,
    );
    return this.window.getByRole('dialog', { name: 'Settings' });
  }

  readCache(): Promise<Record<string, unknown>> {
    return this.window.evaluate(() =>
      globalThis.window.electron.loadPersistentStorage(),
    );
  }

  /** Waits until a change of the persistent storage is written. */
  async waitForCacheSave(): Promise<void> {
    await this.window.waitForTimeout(CACHE_SAVE_DEBOUNCE * 2);
  }

  /** Starts recording page errors and console errors into the returned list. */
  collectErrors(): string[] {
    const errors: string[] = [];
    this.window.on('pageerror', (error) => errors.push(error.message));
    this.window.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });
    return errors;
  }
}
