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

export type { SystemAPIRegistry };

/** @inline */
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
 * The root of the game. The world holds the scenes and exists for the whole
 * game.
 *
 * Systems share their APIs through {@link World.systemApi}. Game-wide events,
 * such as scene changes and input, are dispatched on the world.
 *
 * @see [Scenes and world](https://dachajs.org/concepts/scenes-and-world/)
 *
 * @category Scenes & World
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
