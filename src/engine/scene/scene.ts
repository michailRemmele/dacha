import type { SceneConfig, ActorConfig } from '../types';
import type { TemplateCollection } from '../template';
import type { SystemConstructor } from '../system';
import { System } from '../system';
import {
  Actor,
  ActorSpawner,
  ActorCreator,
} from '../actor';
import { Entity } from '../entity';
import type { EntityOptions } from '../entity';
import type {
  EventType, Event, ListenerFn, EventPayload,
} from '../event-target';
import type { SceneEventMap, ActorEventMap } from '../../types/events';
import type { Constructor } from '../../types/utils';

type SceneObjectListenerFn<T extends EventType> = (
  event: T extends keyof SceneEventMap
    ? SceneEventMap[T]
    : T extends keyof ActorEventMap ? ActorEventMap[T] : Event
) => void;

interface SceneOptions extends EntityOptions, SceneConfig {
  actors: Array<ActorConfig>
  availableSystems: Array<SystemConstructor>
  resources: Record<string, unknown>
  globalOptions: Record<string, unknown>
  actorCreator: ActorCreator
  templateCollection: TemplateCollection
}

export class Scene extends Entity {
  private actorCreator: ActorCreator;
  private availableSystemsMap: Record<string, SystemConstructor>;
  private services: Record<string, unknown>;

  declare public readonly children: Array<Actor>;
  public systems: Array<System>;
  public templateCollection: TemplateCollection;
  public actorSpawner: ActorSpawner;
  public data: Record<string, unknown>;

  declare public parent: null;

  constructor(options: SceneOptions) {
    super(options);

    const {
      actors,
      systems,
      resources,
      globalOptions,
      actorCreator,
      availableSystems,
      templateCollection,
    } = options;

    this.actorCreator = actorCreator;
    this.actorSpawner = new ActorSpawner(this.actorCreator);
    this.templateCollection = templateCollection;

    this.data = {};
    this.services = {};

    actors.forEach((actorOptions) => {
      this.appendChild(this.actorCreator.create(actorOptions));
    });

    this.availableSystemsMap = availableSystems.reduce((acc, AvailableSystem) => {
      acc[AvailableSystem.systemName] = AvailableSystem;
      return acc;
    }, {} as Record<string, SystemConstructor>);

    this.systems = systems.map((config) => new this.availableSystemsMap[config.name]({
      ...config.options,
      templateCollection: this.templateCollection,
      actorSpawner: this.actorSpawner,
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

  override appendChild(child: Actor): void {
    super.appendChild(child);
  }

  override removeChild(child: Actor): void {
    super.removeChild(child);
  }

  override getEntityById(id: string): Actor | undefined {
    return super.getEntityById(id) as Actor | undefined;
  }

  override getEntityByName(name: string): Actor | undefined {
    return super.getEntityByName(name) as Actor | undefined;
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
