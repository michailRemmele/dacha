import type { SceneConfig, GameObjectConfig } from '../types';
import type { TemplateCollection } from '../template';
import type { SystemConstructor } from '../system';
import { System } from '../system';
import {
  GameObject,
  GameObjectSpawner,
  GameObjectCreator,
} from '../game-object';
import { EventTarget } from '../event-target';
import { AddGameObject, RemoveGameObject, Destroy } from '../events';
import type { Constructor } from '../../types/utils';

interface SceneOptions extends SceneConfig {
  gameObjects: Array<GameObjectConfig>
  availableSystems: Array<SystemConstructor>
  resources: Record<string, unknown>
  globalOptions: Record<string, unknown>
  gameObjectCreator: GameObjectCreator
  templateCollection: TemplateCollection
}

export class Scene extends EventTarget {
  private gameObjectMap: Record<string, GameObject>;
  private gameObjectCreator: GameObjectCreator;
  private systems: Array<System>;
  private availableSystemsMap: Record<string, SystemConstructor>;
  private services: Record<string, unknown>;

  public templateCollection: TemplateCollection;
  public gameObjectSpawner: GameObjectSpawner;
  public data: Record<string, unknown>;

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
    this.gameObjectMap = {};
    this.gameObjectCreator = gameObjectCreator;
    this.gameObjectSpawner = new GameObjectSpawner(this, this.gameObjectCreator);
    this.templateCollection = templateCollection;

    this.data = {};
    this.services = {};

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
      scene: this,
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
    if (this.gameObjectMap[gameObject.id]) {
      throw new Error(`The game object with same id already exists: ${gameObject.id}`);
    }

    gameObject.addEventListener(Destroy, () => this.removeGameObject(gameObject.id));

    this.gameObjectMap[gameObject.id] = gameObject;

    this.emit(AddGameObject, { gameObject });

    gameObject.getChildren().forEach((child) => {
      this.addGameObject(child);
    });
  }

  removeGameObject(id: string): void {
    const gameObject = this.gameObjectMap[id];

    if (!gameObject) {
      return;
    }

    delete this.gameObjectMap[id];

    this.emit(RemoveGameObject, { gameObject });
  }

  getGameObject(id: string): GameObject | undefined {
    return this.gameObjectMap[id];
  }

  getGameObjects(): Array<GameObject> {
    return Object.values(this.gameObjectMap);
  }

  addService(service: object): void {
    this.services[service.constructor.name] = service;
  }

  removeService<T>(serviceClass: Constructor<T>): void {
    delete this.services[serviceClass.name];
  }

  getService<T>(serviceClass: Constructor<T>): T {
    if (this.services[serviceClass.name] === undefined) {
      throw new Error(`Can't find service with the following name: ${serviceClass.name}`);
    }

    return this.services[serviceClass.name] as T;
  }
}
