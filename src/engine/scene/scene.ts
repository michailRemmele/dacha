import type { SceneConfig, GameObjectConfig } from '../types';
import type { SystemOptions, HelperFn } from '../system';
import { System } from '../system';
import {
  GameObjectObserver,
  GameObjectObserverFilter,
  GameObject,
  GameObjectSpawner,
  GameObjectDestroyer,
  GameObjectCreator,
} from '../game-object';
import { MessageBus } from '../message-bus';

import { SceneContext } from './context';
import { Store } from './store';
import { GAME_OBJECT_ADDED, GAME_OBJECT_REMOVED } from './consts';

export interface GameObjectChangeEvent {
  type: string
  gameObject: GameObject
}

interface SceneOptions extends SceneConfig {
  gameObjects: Array<GameObjectConfig>
  availableSystems: Record<string, { new(options: SystemOptions): System }>
  helpers: Record<string, HelperFn>
  gameObjectCreator: GameObjectCreator
}

export class Scene {
  private name: string;
  private gameObjects: Record<string, GameObject>;
  private store: Store;
  private context: SceneContext;
  private gameObjectCreator: GameObjectCreator;
  private gameObjectSpawner: GameObjectSpawner;
  private gameObjectDestroyer: GameObjectDestroyer;
  private messageBus: MessageBus;
  private systems: Array<System>;
  private gameObjectsChangeSubscribers: Array<(event: GameObjectChangeEvent) => void>;

  constructor({
    name,
    gameObjects,
    systems,
    helpers,
    gameObjectCreator,
    availableSystems,
  }: SceneOptions) {
    this.name = name;
    this.gameObjects = {};
    this.gameObjectsChangeSubscribers = [];
    this.store = new Store();
    this.gameObjectCreator = gameObjectCreator;
    this.gameObjectSpawner = new GameObjectSpawner(this, this.gameObjectCreator);
    this.gameObjectDestroyer = new GameObjectDestroyer(this);
    this.messageBus = new MessageBus();
    this.context = new SceneContext(this.name);

    gameObjects.forEach((gameObjectOptions) => {
      this.gameObjectCreator.create(gameObjectOptions).forEach((gameObject: GameObject) => {
        this.addGameObject(gameObject);
      });
    });

    this.systems = systems.map((config) => new availableSystems[config.name]({
      ...config.options,
      store: this.getStore(),
      gameObjectSpawner: this.getGameObjectSpawner(),
      gameObjectDestroyer: this.getGameObjectDestroyer(),
      createGameObjectObserver: (filter): GameObjectObserver => this.createGameObjectObserver(
        filter,
      ),
      messageBus: this.getMessageBus(),
      helpers,
      sceneContext: this.context,
    }));
  }

  load(): Promise<Array<void>> | undefined {
    if (this.systems.every((system) => !system.load)) {
      return void 0;
    }

    return Promise.all(this.systems.map((system) => {
      if (system.load) {
        return system.load();
      }
      return Promise.resolve();
    }));
  }

  mount(): void {
    this.systems.forEach((system) => {
      if (system.mount) {
        system.mount();
      }
    });
  }

  unmount(): void {
    this.systems.forEach((system) => {
      if (system.unmount) {
        system.unmount();
      }
    });
  }

  getSystems(): Array<System> {
    return this.systems;
  }

  getStore(): Store {
    return this.store;
  }

  createGameObjectObserver(filter: GameObjectObserverFilter): GameObjectObserver {
    return new GameObjectObserver(this, filter);
  }

  getGameObjectSpawner(): GameObjectSpawner {
    return this.gameObjectSpawner;
  }

  getGameObjectDestroyer(): GameObjectDestroyer {
    return this.gameObjectDestroyer;
  }

  getMessageBus(): MessageBus {
    return this.messageBus;
  }

  addGameObject(gameObject: GameObject): void {
    const id = gameObject.getId();

    if (this.gameObjects[id]) {
      throw new Error(`The game object with same id already exists: ${id}`);
    }

    this.gameObjects[id] = gameObject;

    this.gameObjectsChangeSubscribers.forEach((callback) => {
      callback({
        type: GAME_OBJECT_ADDED,
        gameObject,
      });
    });
  }

  removeGameObject(gameObject: GameObject): void {
    gameObject.clearSubscriptions();
    this.gameObjects = Object.keys(this.gameObjects)
      .reduce((acc: Record<string, GameObject>, key) => {
        if (key !== gameObject.getId()) {
          acc[key] = this.gameObjects[key];
        }

        return acc;
      }, {});

    this.gameObjectsChangeSubscribers.forEach((callback) => {
      callback({
        type: GAME_OBJECT_REMOVED,
        gameObject,
      });
    });
  }

  getName(): string {
    return this.name;
  }

  getGameObjects(): Array<GameObject> {
    return Object.values(this.gameObjects);
  }

  subscribeOnGameObjectsChange(callback: (event: GameObjectChangeEvent) => void): void {
    if (!(callback instanceof Function)) {
      throw new Error('On subscribe callback should be a function');
    }

    this.gameObjectsChangeSubscribers.push(callback);
  }
}
