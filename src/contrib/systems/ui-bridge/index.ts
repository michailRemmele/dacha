import { Scene } from '../../../engine/scene';
import { System } from '../../../engine/system';
import type {
  SystemOptions,
  UpdateOptions,
} from '../../../engine/system';
import type { TemplateCollection } from '../../../engine/template';

import { Observer } from './observer';

interface ActionFnOptions {
  scene: Scene
  actorSpawner: unknown
  deltaTime: number
}

type ActionFn = (options: ActionFnOptions) => void;

export interface UiInitFnOptions {
  scene: Scene
  templateCollection: TemplateCollection
  globalOptions: Record<string, unknown>
  gameStateObserver: Observer
  pushAction: (action: ActionFn) => void
}

export type UiInitFn = (options: UiInitFnOptions) => void;
export type UiDestroyFn = () => void;
export type LoadUiAppFn = () => Promise<{ onInit: UiInitFn, onDestroy: UiDestroyFn }>;

interface UiBridgeResources {
  loadUiApp?: LoadUiAppFn
}

export class UiBridge extends System {
  private actorSpawner: unknown;
  private scene: Scene;
  private loadUiApp: LoadUiAppFn;
  private templateCollection: TemplateCollection;
  private globalOptions: Record<string, unknown>;
  private gameStateObserver: Observer;
  private actionsQueue: Array<ActionFn>;
  private onUiInit?: UiInitFn;
  private onUiDestroy?: UiDestroyFn;

  constructor(options: SystemOptions) {
    super();

    const {
      actorSpawner,
      resources,
      scene,
      templateCollection,
      globalOptions,
    } = options;

    const loadUiApp = (resources as UiBridgeResources | undefined)?.loadUiApp;

    if (loadUiApp === undefined) {
      throw new Error('UiBridge requires a UI loader. Please specify the loader in the resources section.');
    }

    this.loadUiApp = loadUiApp;

    this.scene = scene;
    this.actorSpawner = actorSpawner;
    this.templateCollection = templateCollection;
    this.globalOptions = globalOptions;

    this.gameStateObserver = new Observer();

    this.actionsQueue = [];
  }

  async load(): Promise<void> {
    const { onInit, onDestroy } = await this.loadUiApp();

    this.onUiInit = onInit;
    this.onUiDestroy = onDestroy;
  }

  mount(): void {
    if (this.onUiInit) {
      this.onUiInit({
        scene: this.scene,
        templateCollection: this.templateCollection,
        globalOptions: this.globalOptions,
        gameStateObserver: this.gameStateObserver,
        pushAction: this.pushAction.bind(this),
      });
    }
  }

  unmount(): void {
    if (this.onUiDestroy) {
      this.onUiDestroy();
    }
  }

  private pushAction(action: ActionFn): void {
    this.actionsQueue.push(action);
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    this.gameStateObserver.next();

    this.actionsQueue.forEach((action) => {
      action({
        scene: this.scene,
        deltaTime,
        actorSpawner: this.actorSpawner,
      });
    });
    this.actionsQueue = [];
  }
}

UiBridge.systemName = 'UiBridge';
