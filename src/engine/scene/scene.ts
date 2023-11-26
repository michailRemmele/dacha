import type { SceneConfig, GameObjectConfig } from '../types';
import type { TemplateCollection } from '../template';
import type { System, SystemConstructor } from '../system';
import { SystemController } from '../system';
import {
  GameObject,
  GameObjectSpawner,
  GameObjectDestroyer,
  GameObjectCreator,
} from '../game-object';
import { MessageBus } from '../message-bus';

import { SceneContext } from './context';
import { GAME_OBJECT_ADDED, GAME_OBJECT_REMOVED } from './consts';

export interface GameObjectChangeEvent {
  type: string
  gameObject: GameObject
}

interface SceneOptions extends SceneConfig {
  gameObjects: Array<GameObjectConfig>
  availableSystems: Array<SystemConstructor>
  resources: Record<string, unknown>
  globalOptions: Record<string, unknown>
  gameObjectCreator: GameObjectCreator
  templateCollection: TemplateCollection
}

export class Scene {
  private gameObjects: Record<string, GameObject>;
  private gameObjectCreator: GameObjectCreator;
  private systems: Array<System>;
  private gameObjectsChangeSubscribers: Array<(event: GameObjectChangeEvent) => void>;
  private availableSystemsMap: Record<string, SystemConstructor>;

  public templateCollection: TemplateCollection;
  public gameObjectSpawner: GameObjectSpawner;
  public gameObjectDestroyer: GameObjectDestroyer;
  public messageBus: MessageBus;
  public context: SceneContext;

  readonly id: string;
  readonly name: string;

  constructor({
    id,
    name,
    gameObjects,
    systems,
    resources,
    globalOptions,
    gameObjectCreator,
    availableSystems,
    templateCollection,
  }: SceneOptions) {
    this.id = id;
    this.name = name;
    this.gameObjects = {};
    this.gameObjectsChangeSubscribers = [];
    this.gameObjectCreator = gameObjectCreator;
    this.gameObjectSpawner = new GameObjectSpawner(this, this.gameObjectCreator);
    this.gameObjectDestroyer = new GameObjectDestroyer(this);
    this.messageBus = new MessageBus();
    this.context = new SceneContext(this.name);
    this.templateCollection = templateCollection;

    gameObjects.forEach((gameObjectOptions) => {
      this.addGameObject(this.gameObjectCreator.create(gameObjectOptions));
    });

    this.availableSystemsMap = availableSystems.reduce((acc, AvailableSystem) => {
      acc[AvailableSystem.systemName] = AvailableSystem;
      return acc;
    }, {} as Record<string, SystemConstructor>);

    this.systems = systems.map((config) => new SystemController({
      systemOptions: config.options,
      globalOptions,
      resources: resources[config.name],
      scene: this,
      SystemClass: this.availableSystemsMap[config.name],
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

    gameObject.getChildren().forEach((child) => {
      this.addGameObject(child);
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
