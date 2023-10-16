import { System } from '../../../engine/system';
import type {
  SystemOptions,
  UpdateOptions,
  HelperFn,
} from '../../../engine/system';
import type { GameObject, GameObjectObserver } from '../../../engine/game-object';
import type { MessageBus, Message } from '../../../engine/message-bus';
import type { Store, SceneContext } from '../../../engine/scene';
import type { TemplateCollection } from '../../../engine/template';

import { Observer, MapObserver } from './observer';

interface ActionFnOptions {
  messageBus: MessageBus
  store: Store
  gameObjectSpawner: unknown
  gameObjectDestroyer: unknown
  deltaTime: number
}

type ActionFn = (options: ActionFnOptions) => void;

export interface UiInitFnOptions {
  sceneContext: SceneContext
  templateCollection: TemplateCollection
  messageBusObserver: Observer
  storeObserver: Observer
  gameObjects: MapObserver
  pushMessage: (message: Message) => void
  pushAction: (action: ActionFn) => void
}

export type UiInitFn = (options: UiInitFnOptions) => void;
export type UiDestroyFn = () => void;

interface UiBridgeOptions extends SystemOptions {
  filterComponents: Array<string>;
}

export class UiBridge extends System {
  private sceneContext: SceneContext;
  private gameObjectObserver: GameObjectObserver;
  private gameObjectSpawner: unknown;
  private gameObjectDestroyer: unknown;
  private store: Store;
  private messageBus: MessageBus;
  private helpers: Record<string, HelperFn>;
  private templateCollection: TemplateCollection;
  private messageBusObserver: Observer;
  private storeObserver: Observer;
  private gameObjects: MapObserver;
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
      store,
      messageBus,
      helpers,
      sceneContext,
      templateCollection,
      filterComponents,
    } = options as UiBridgeOptions;

    this.sceneContext = sceneContext;
    this.gameObjectObserver = createGameObjectObserver({
      components: filterComponents,
    });
    this.gameObjectSpawner = gameObjectSpawner;
    this.gameObjectDestroyer = gameObjectDestroyer;
    this.store = store;
    this.messageBus = messageBus;
    this.helpers = helpers;
    this.templateCollection = templateCollection;

    this.messageBusObserver = new Observer();
    this.storeObserver = new Observer();
    this.gameObjects = new MapObserver();

    this.messageQueue = [];
    this.actionsQueue = [];
  }

  async load(): Promise<void> {
    const { onInit, onDestroy } = await this.helpers.loadUiApp();

    this.onUiInit = onInit as UiInitFn;
    this.onUiDestroy = onDestroy as UiDestroyFn;
  }

  mount(): void {
    if (this.onUiInit) {
      this.onUiInit({
        sceneContext: this.sceneContext,
        templateCollection: this.templateCollection,
        messageBusObserver: this.messageBusObserver,
        storeObserver: this.storeObserver,
        pushMessage: this.pushMessage.bind(this),
        pushAction: this.pushAction.bind(this),
        gameObjects: this.gameObjects,
      });
    }
    this.gameObjectObserver.subscribe('onremove', this.handleGameObjectRemove);
  }

  unmount(): void {
    if (this.onUiDestroy) {
      this.onUiDestroy();
    }
    this.gameObjectObserver.unsubscribe('onremove', this.handleGameObjectRemove);
  }

  private handleGameObjectRemove = (gameObject: GameObject): void => {
    this.gameObjects.next(null, gameObject.getId());
  };

  private pushAction(action: ActionFn): void {
    this.actionsQueue.push(action);
  }

  private pushMessage(message: Message): void {
    this.messageQueue.push(message);
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    this.gameObjectObserver.fireEvents();

    this.gameObjectObserver.forEach((gameObject) => {
      this.gameObjects.next(gameObject, gameObject.getId());
    });

    this.messageBusObserver.next(this.messageBus);
    this.storeObserver.next(this.store);

    this.messageQueue.forEach((message) => {
      this.messageBus.send(message, true);
    });

    this.messageQueue = [];

    this.actionsQueue.forEach((action) => {
      action({
        messageBus: this.messageBus,
        deltaTime,
        store: this.store,
        gameObjectSpawner: this.gameObjectSpawner,
        gameObjectDestroyer: this.gameObjectDestroyer,
      });
    });

    this.actionsQueue = [];
  }
}

UiBridge.systemName = 'UiBridge';
