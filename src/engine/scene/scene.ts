import type { SceneConfig, GameObjectConfig } from '../types';
import type { TemplateCollection } from '../template';
import type { SystemConstructor } from '../system';
import { System } from '../system';
import {
  GameObject,
  GameObjectSpawner,
  GameObjectCreator,
} from '../game-object';
import { BaseObject } from '../base-object';
import type { BaseObjectOptions } from '../base-object';
import type {
  EventType, Event, ListenerFn, EventPayload,
} from '../event-target';
import type { SceneEventMap, GameObjectEventMap } from '../../types/events';
import type { Constructor } from '../../types/utils';

type SceneObjectListenerFn<T extends EventType> = (
  event: T extends keyof SceneEventMap
    ? SceneEventMap[T]
    : T extends keyof GameObjectEventMap ? GameObjectEventMap[T] : Event
) => void;

interface SceneOptions extends BaseObjectOptions, SceneConfig {
  gameObjects: Array<GameObjectConfig>
  availableSystems: Array<SystemConstructor>
  resources: Record<string, unknown>
  globalOptions: Record<string, unknown>
  gameObjectCreator: GameObjectCreator
  templateCollection: TemplateCollection
}

export class Scene extends BaseObject {
  private gameObjectCreator: GameObjectCreator;
  private systems: Array<System>;
  private availableSystemsMap: Record<string, SystemConstructor>;
  private services: Record<string, unknown>;

  declare public readonly children: Array<GameObject>;
  public templateCollection: TemplateCollection;
  public gameObjectSpawner: GameObjectSpawner;
  public data: Record<string, unknown>;

  declare public parent: null;

  constructor(options: SceneOptions) {
    super(options);

    const {
      gameObjects,
      systems,
      resources,
      globalOptions,
      gameObjectCreator,
      availableSystems,
      templateCollection,
    } = options;

    this.gameObjectCreator = gameObjectCreator;
    this.gameObjectSpawner = new GameObjectSpawner(this.gameObjectCreator);
    this.templateCollection = templateCollection;

    this.data = {};
    this.services = {};

    gameObjects.forEach((gameObjectOptions) => {
      this.appendChild(this.gameObjectCreator.create(gameObjectOptions));
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

  override addEventListener<T extends EventType>(
    type: T,
    callback: SceneObjectListenerFn<T>,
  ): void {
    super.addEventListener(type, callback as ListenerFn);
  }

  override removeEventListener<T extends EventType>(
    type: T,
    callback: SceneObjectListenerFn<T>,
  ): void {
    super.removeEventListener(type, callback as ListenerFn);
  }

  override emit<T extends EventType>(
    type: T,
    ...payload: EventPayload<SceneEventMap, T>
  ): void {
    super.emit(type, ...payload);
  }

  override appendChild(child: GameObject): void {
    super.appendChild(child);
  }

  override removeChild(child: GameObject): void {
    super.removeChild(child);
  }

  override getObjectById(id: string): GameObject | undefined {
    return super.getObjectById(id) as GameObject | undefined;
  }

  override getObjectByName(name: string): GameObject | undefined {
    return super.getObjectByName(name) as GameObject | undefined;
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
