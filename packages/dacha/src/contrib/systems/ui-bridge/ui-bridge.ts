import type { World } from '../../../engine/world';
import type { Scene } from '../../../engine/scene';
import type { Assets } from '../../../engine/asset';
import { WorldSystem } from '../../../engine/system';
import { DefineSystem, getSchema } from '../../../engine/decorators';
import type { WorldSystemOptions } from '../../../engine/system';

import type { LoadUIFn, UIDestroyFn, UIInitFn } from './types';
import { UIContextHost } from './ui-context';

/**
 * The dependencies of {@link UIBridge}. Pass them with
 * `UIBridge.with({ loadUI })`.
 *
 * @category Game UI
 */
export interface UIBridgeDependencies {
  /** Loads the interface module. */
  loadUI: LoadUIFn;
}

/**
 * Loads your game interface and runs it together with the game.
 *
 * Pass a loader with `UIBridge.with({ loadUI })`. The loader returns a module
 * with `onInit` and `onDestroy`, see {@link LoadUIFn}. The system calls `onInit` with
 * a {@link UIContext} when the world is ready, and `onDestroy` when the world is
 * destroyed.
 *
 * To give the interface settings, extend the class and declare fields with
 * {@link DefineField}. You edit them in the system's settings, and the interface
 * reads them from {@link UIContext.options}.
 *
 * @example
 * ```ts
 * const engine = new Engine({
 *   config,
 *   systems: [
 *     UIBridge.with({ loadUI: () => import('./ui') }),
 *     ...gameSystems,
 *   ],
 *   components: [...gameComponents],
 *   assets: [],
 * });
 * ```
 *
 * @example
 * ```ts
 * @DefineSystem({ name: 'GameUI' })
 * export default class GameUI extends UIBridge {
 *   @DefineField({ type: 'scene' })
 *   mainMenu = '';
 * }
 * ```
 *
 * @see [Game UI](https://dachajs.org/systems/game-ui/)
 *
 * @category Game UI
 */
@DefineSystem({ name: 'UIBridge', icon: 'LayoutHeaderSideContent' })
export class UIBridge extends WorldSystem {
  private world: World;
  private assets: Assets;
  private loadUI: LoadUIFn;
  private onUIInit?: UIInitFn;
  private onUIDestroy?: UIDestroyFn;
  private host?: UIContextHost;

  constructor(
    options: WorldSystemOptions,
    dependencies?: UIBridgeDependencies,
  ) {
    super(options);

    const loadUI = dependencies?.loadUI;

    if (loadUI === undefined) {
      throw new Error(
        'UIBridge requires a UI loader. Pass it with UIBridge.with({ loadUI }).',
      );
    }

    this.loadUI = loadUI;
    this.world = options.world;
    this.assets = options.assets;
  }

  async onWorldLoad(): Promise<void> {
    const { onInit, onDestroy } = await this.loadUI();

    this.onUIInit = onInit;
    this.onUIDestroy = onDestroy;
  }

  onWorldReady(): void {
    if (!this.onUIInit) {
      return;
    }

    this.host = new UIContextHost({
      world: this.world,
      assets: this.assets,
      options: this.getOptions(),
    });
    this.onUIInit(this.host.context);
  }

  onSceneEnter(scene: Scene): void {
    this.host?.setScene(scene);
  }

  onSceneExit(): void {
    this.host?.setScene(undefined);
  }

  update(): void {
    this.host?.tick();
  }

  onWorldDestroy(): void {
    if (!this.host) {
      return;
    }

    this.onUIDestroy?.();
    this.host.destroy();
    this.host = undefined;
  }

  private getOptions(): Record<string, unknown> {
    const values = this as unknown as Record<string, unknown>;
    const options: Record<string, unknown> = {};

    getSchema(this.constructor)?.fields.forEach(({ name }) => {
      options[name] = values[name];
    });

    return options;
  }
}
