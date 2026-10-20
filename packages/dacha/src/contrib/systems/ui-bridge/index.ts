import { World } from '../../../engine/world';
import { WorldSystem } from '../../../engine/system';
import { DefineSystem } from '../../../engine/decorators';
import type { WorldSystemOptions } from '../../../engine/system';
import type { TemplateCollection } from '../../../engine/template';
import type { ActorSpawner } from '../../../engine/actor';

/**
 * What `onInit` of the interface module gets.
 *
 * @category Game UI
 */
export interface UIOptions {
  /** The world. Use it to dispatch and listen for events, and to reach `systemApi`. */
  world: World;
  /** The actor templates. */
  templateCollection: TemplateCollection;
  /** Creates actors from templates. */
  actorSpawner: ActorSpawner;
  /** The global options of the game, by name. */
  globalOptions: Record<string, unknown>;
}

/**
 * Starts the interface. {@link UIBridge} calls it when the world is ready.
 *
 * @category Game UI
 */
export type UIInitFn = (options: UIOptions) => void;
/**
 * Stops the interface. {@link UIBridge} calls it when the world is destroyed.
 *
 * @category Game UI
 */
export type UIDestroyFn = () => void;
/**
 * Loads the interface module. It usually is `() => import('./ui')`.
 *
 * @category Game UI
 */
export type LoadUIFn = () => Promise<{
  onInit: UIInitFn;
  onDestroy: UIDestroyFn;
}>;

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
 * {@link UIOptions} when the world is ready, and `onDestroy` when the world is destroyed.
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
 * @see [Game UI](https://dachajs.org/systems/game-ui/)
 *
 * @category Game UI
 */
@DefineSystem({ name: 'UIBridge', icon: 'LayoutHeaderSideContent' })
export class UIBridge extends WorldSystem {
  private actorSpawner: ActorSpawner;
  private world: World;
  private loadUI: LoadUIFn;
  private templateCollection: TemplateCollection;
  private globalOptions: Record<string, unknown>;
  private onUIInit?: UIInitFn;
  private onUIDestroy?: UIDestroyFn;

  constructor(
    options: WorldSystemOptions,
    dependencies?: UIBridgeDependencies,
  ) {
    super();

    const { world, actorSpawner, templateCollection, globalOptions } = options;

    const loadUI = dependencies?.loadUI;

    if (loadUI === undefined) {
      throw new Error(
        'UIBridge requires a UI loader. Pass it with UIBridge.with({ loadUI }).',
      );
    }

    this.loadUI = loadUI;

    this.world = world;
    this.actorSpawner = actorSpawner;
    this.templateCollection = templateCollection;
    this.globalOptions = globalOptions;
  }

  async onWorldLoad(): Promise<void> {
    const { onInit, onDestroy } = await this.loadUI();

    this.onUIInit = onInit;
    this.onUIDestroy = onDestroy;
  }

  onWorldReady(): void {
    this.onUIInit?.({
      world: this.world,
      templateCollection: this.templateCollection,
      actorSpawner: this.actorSpawner,
      globalOptions: this.globalOptions,
    });
  }

  onWorldDestroy(): void {
    this.onUIDestroy?.();
  }
}
