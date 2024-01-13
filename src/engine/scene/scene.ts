import type { SceneConfig, GameObjectConfig } from '../types';
import type { TemplateCollection } from '../template';
import type { SystemConstructor } from '../system';
import { System } from '../system';
import {
  GameObject,
  GameObjectSpawner,
  GameObjectDestroyer,
  GameObjectCreator,
  GameObjectObserver,
} from '../game-object';
import type { GameObjectObserverFilter } from '../game-object';
import { EventEmitter } from '../event-emitter';
import { AddGameObject, RemoveGameObject } from '../events';

import { SceneContext } from './context';

interface SceneOptions extends SceneConfig {
  gameObjects: Array<GameObjectConfig>
  availableSystems: Array<SystemConstructor>
  resources: Record<string, unknown>
  globalOptions: Record<string, unknown>
  gameObjectCreator: GameObjectCreator
  templateCollection: TemplateCollection
}

export class Scene extends EventEmitter {
  private gameObjects: Record<string, GameObject>;
  private gameObjectCreator: GameObjectCreator;
  private systems: Array<System>;
  private availableSystemsMap: Record<string, SystemConstructor>;

  public templateCollection: TemplateCollection;
  public gameObjectSpawner: GameObjectSpawner;
  public gameObjectDestroyer: GameObjectDestroyer;
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
    super();

    this.id = id;
    this.name = name;
    this.gameObjects = {};
    this.gameObjectCreator = gameObjectCreator;
    this.gameObjectSpawner = new GameObjectSpawner(this, this.gameObjectCreator);
    this.gameObjectDestroyer = new GameObjectDestroyer(this);
    this.context = new SceneContext(this.name);
    this.templateCollection = templateCollection;

    gameObjects.forEach((gameObjectOptions) => {
      this.addGameObject(this.gameObjectCreator.create(gameObjectOptions));
    });

    this.availableSystemsMap = availableSystems.reduce((acc, AvailableSystem) => {
      acc[AvailableSystem.systemName] = AvailableSystem;
      return acc;
    }, {} as Record<string, SystemConstructor>);

    this.systems = systems.map((config) => new this.availableSystemsMap[config.name]({
      ...config.options,
      templateCollection: this.templateCollection,
      gameObjectSpawner: this.gameObjectSpawner,
      gameObjectDestroyer: this.gameObjectDestroyer,
      scene: this,
      createGameObjectObserver: (filter?: GameObjectObserverFilter): GameObjectObserver => {
        const gameObjectObserver = new GameObjectObserver(this, filter);
        return gameObjectObserver;
      },
      resources: resources[config.name],
      globalOptions,
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

    this.emit(AddGameObject, { gameObject });

    gameObject.getChildren().forEach((child) => {
      this.addGameObject(child);
    });
  }

  removeGameObject(gameObject: GameObject): void {
    gameObject.removeAllListeners();
    this.gameObjects = Object.keys(this.gameObjects)
      .reduce((acc: Record<string, GameObject>, key) => {
        if (key !== gameObject.getId()) {
          acc[key] = this.gameObjects[key];
        }

        return acc;
      }, {});

    this.emit(RemoveGameObject, { gameObject });
  }

  getGameObjects(): Array<GameObject> {
    return Object.values(this.gameObjects);
  }
}
