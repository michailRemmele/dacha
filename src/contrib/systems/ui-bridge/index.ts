import { System } from '../../../engine/system';
import type {
  SystemOptions,
  UpdateOptions,
} from '../../../engine/system';
import type { GameObjectObserver } from '../../../engine/game-object';
import type { MessageBus, Message } from '../../../engine/message-bus';
import type { SceneContext } from '../../../engine/scene';
import type { TemplateCollection } from '../../../engine/template';

import { Observer } from './observer';

interface ActionFnOptions {
  messageBus: MessageBus
  gameObjectSpawner: unknown
  gameObjectDestroyer: unknown
  deltaTime: number
}

type ActionFn = (options: ActionFnOptions) => void;

export interface UiInitFnOptions {
  messageBus: MessageBus
  sceneContext: SceneContext
  templateCollection: TemplateCollection
  gameObjectObserver: GameObjectObserver
  gameStateObserver: Observer
  pushMessage: (message: Message) => void
  pushAction: (action: ActionFn) => void
}

export type UiInitFn = (options: UiInitFnOptions) => void;
export type UiDestroyFn = () => void;
export type LoadUiAppFn = () => Promise<{ onInit: UiInitFn, onDestroy: UiDestroyFn }>;

interface UiBridgeResources {
  loadUiApp?: LoadUiAppFn
}

export class UiBridge extends System {
  private sceneContext: SceneContext;
  private gameObjectObserver: GameObjectObserver;
  private gameObjectSpawner: unknown;
  private gameObjectDestroyer: unknown;
  private messageBus: MessageBus;
  private loadUiApp: LoadUiAppFn;
  private templateCollection: TemplateCollection;
  private gameStateObserver: Observer;
  private messageQueue: Array<Message>;
  private actionsQueue: Array<ActionFn>;
  private onUiInit?: UiInitFn;
  private onUiDestroy?: UiDestroyFn;

  constructor(options: SystemOptions) {
    super();

    const {
      createGameObjectObserver,
      gameObjectSpawner,
      gameObjectDestroyer,
      messageBus,
      resources,
      sceneContext,
      templateCollection,
    } = options;

    const loadUiApp = (resources as UiBridgeResources | undefined)?.loadUiApp;

    if (loadUiApp === undefined) {
      throw new Error('UiBridge requires a UI loader. Please specify the loader in the resources section.');
    }

    this.loadUiApp = loadUiApp;

    this.sceneContext = sceneContext;
    this.gameObjectObserver = createGameObjectObserver({});
    this.gameObjectSpawner = gameObjectSpawner;
    this.gameObjectDestroyer = gameObjectDestroyer;
    this.messageBus = messageBus;
    this.templateCollection = templateCollection;

    this.gameStateObserver = new Observer();

    this.messageQueue = [];
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
        messageBus: this.messageBus,
        sceneContext: this.sceneContext,
        templateCollection: this.templateCollection,
        gameStateObserver: this.gameStateObserver,
        gameObjectObserver: this.gameObjectObserver,
        pushMessage: this.pushMessage.bind(this),
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

  private pushMessage(message: Message): void {
    this.messageQueue.push(message);
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    this.gameStateObserver.next();

    this.messageQueue.forEach((message) => {
      this.messageBus.send(message, true);
    });
    this.messageQueue = [];

    this.actionsQueue.forEach((action) => {
      action({
        messageBus: this.messageBus,
        deltaTime,
        gameObjectSpawner: this.gameObjectSpawner,
        gameObjectDestroyer: this.gameObjectDestroyer,
      });
    });
    this.actionsQueue = [];
  }
}

UiBridge.systemName = 'UiBridge';
