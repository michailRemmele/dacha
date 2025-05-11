import type { Scene } from '../scene';
import type { Actor } from '../actor';
import type { WorldEventMap, SceneEventMap, ActorEventMap } from '../../types/events';
import { Entity } from '../entity';
import type { EntityOptions } from '../entity';
import type {
  EventType, Event, ListenerFn, EventPayload,
} from '../event-target';
import type { Constructor } from '../../types/utils';

type WorldListenerFn<T extends EventType> = (
  event: T extends keyof WorldEventMap
    ? WorldEventMap[T]
    : T extends keyof SceneEventMap ? SceneEventMap[T] :
      T extends keyof ActorEventMap ? ActorEventMap[T] : Event
) => void;

export class World extends Entity {
  private services: Record<string, unknown>;

  declare public readonly children: Scene[];

  data: Record<string, unknown>;

  declare public parent: null;

  constructor(options: EntityOptions) {
    super(options);

    this.data = {};
    this.services = {};
  }

  override addEventListener<T extends EventType>(
    type: T,
    callback: WorldListenerFn<T>,
  ): void {
    super.addEventListener(type, callback as ListenerFn);
  }

  override removeEventListener<T extends EventType>(
    type: T,
    callback: WorldListenerFn<T>,
  ): void {
    super.removeEventListener(type, callback as ListenerFn);
  }

  override dispatchEvent<T extends EventType>(
    type: T,
    ...payload: EventPayload<WorldEventMap, T>
  ): void {
    super.dispatchEvent(type, ...payload);
  }

  override dispatchEventImmediately<T extends EventType>(
    type: T,
    ...payload: EventPayload<WorldEventMap, T>
  ): void {
    super.dispatchEventImmediately(type, ...payload);
  }

  override appendChild(child: Scene): void {
    super.appendChild(child);
  }

  override removeChild(child: Scene): void {
    super.removeChild(child);
  }

  override findChild(
    predicate: (child: Scene | Actor) => boolean,
    recursive = true,
  ): Scene | Actor | undefined {
    return super.findChild(
      predicate as (child: Entity) => boolean,
      recursive,
    ) as Scene | Actor | undefined;
  }

  override findChildById(id: string, recursive = true): Scene | Actor | undefined {
    return super.findChildById(id, recursive) as Scene | Actor | undefined;
  }

  override findChildByName(name: string, recursive = true): Scene | Actor | undefined {
    return super.findChildByName(name, recursive) as Scene | Actor | undefined;
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
