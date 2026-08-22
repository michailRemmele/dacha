import type { Scene } from '../scene';
import type { Actor } from '../actor';
import type {
  WorldEventMap,
  SceneEventMap,
  ActorEventMap,
} from '../../types/events';
import { Entity } from '../entity';
import type { EntityOptions } from '../entity';
import type {
  EventType,
  Event,
  ListenerFn,
  EventPayload,
} from '../event-target';
import { SystemAPIRegistry } from './system-api-registry';

type WorldListenerFn<T extends EventType> = (
  event: T extends keyof WorldEventMap
    ? WorldEventMap[T]
    : T extends keyof SceneEventMap
      ? SceneEventMap[T]
      : T extends keyof ActorEventMap
        ? ActorEventMap[T]
        : Event,
) => void;

/**
 * A world is the root container for all scenes and actors.
 * It is also provide an access to system APIs.
 *
 * @extends {Entity}
 *
 * @category Core
 */
export class World extends Entity {
  /** Registry of system APIs */
  readonly systemApi: SystemAPIRegistry;

  declare public readonly children: Scene[];

  /** Custom data storage for world-related information */
  data: Record<string, unknown>;

  declare public parent: null;

  constructor(options: EntityOptions) {
    super(options);

    this.systemApi = new SystemAPIRegistry();
    this.data = {};
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

  override findChildById(
    id: string,
    recursive = true,
  ): Scene | Actor | undefined {
    return super.findChildById(id, recursive) as Scene | Actor | undefined;
  }

  override findChildByName(
    name: string,
    recursive = true,
  ): Scene | Actor | undefined {
    return super.findChildByName(name, recursive) as Scene | Actor | undefined;
  }
}
