import { World } from '../../../engine/world';
import { WorldSystem } from '../../../engine/system';
import type { WorldSystemOptions } from '../../../engine/system';
import type { TemplateCollection } from '../../../engine/template';
import type { ActorSpawner } from '../../../engine/actor';

export interface UIOptions {
  world: World;
  templateCollection: TemplateCollection;
  actorSpawner: ActorSpawner;
  globalOptions: Record<string, unknown>;
}

export type UIInitFn = (options: UIOptions) => void;
export type UIDestroyFn = () => void;
export type LoadUIFn = () => Promise<{
  onInit: UIInitFn;
  onDestroy: UIDestroyFn;
}>;

interface UIBridgeResources {
  loadUI?: LoadUIFn;
}

/**
 * UI bridge system that manages external UI integration
 *
 * Handles loading and lifecycle management of external UI modules.
 * Provides a bridge between the game engine and external UI frameworks,
 * allowing seamless integration of UI components with the game world.
 *
 * @extends WorldSystem
 * 
 * @category Systems
 */
export class UIBridge extends WorldSystem {
  private actorSpawner: ActorSpawner;
  private world: World;
  private loadUI: LoadUIFn;
  private templateCollection: TemplateCollection;
  private globalOptions: Record<string, unknown>;
  private onUIInit?: UIInitFn;
  private onUIDestroy?: UIDestroyFn;

  constructor(options: WorldSystemOptions) {
    super();

    const {
      world,
      actorSpawner,
      templateCollection,
      resources,
      globalOptions,
    } = options;

    const loadUI = (resources as UIBridgeResources | undefined)?.loadUI;

    if (loadUI === undefined) {
      throw new Error(
        'UIBridge requires a UI loader. Please specify the loader in the resources section.',
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

UIBridge.systemName = 'UIBridge';
