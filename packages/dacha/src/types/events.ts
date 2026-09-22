import type { Event } from '../engine/event-target';
import type { Actor } from '../engine/actor';
import type { Scene } from '../engine/scene';
import type { World } from '../engine/world';

/**
 * An event dispatched on an actor. `T` is the payload.
 *
 * @example
 * ```ts
 * export type DamagedEvent = ActorEvent<{ amount: number }>;
 * ```
 *
 * @category Events
 */
export type ActorEvent<T = Record<string, never>> = Event<Actor> & T;
/**
 * An event dispatched on a scene. `T` is the payload.
 *
 * @category Events
 */
export type SceneEvent<T = Record<string, never>> = Event<Scene> & T;
/**
 * An event dispatched on the world. `T` is the payload.
 *
 * @category Events
 */
export type WorldEvent<T = Record<string, never>> = Event<World> & T;

/**
 * The events dispatched on a scene, by name. Scenes and the world get typed
 * listeners for them.
 *
 * Add your own events to it with a `declare module 'dacha'` block. See
 * {@link ActorEventMap} for an example.
 *
 * @see [Events](https://dachajs.org/concepts/events/)
 *
 * @category Events
 */
export interface SceneEventMap {}

/**
 * The events dispatched on an actor, by name. Actors, scenes and the world get
 * typed listeners for them.
 *
 * Add your own events to it with a `declare module 'dacha'` block.
 *
 * @example
 * ```ts
 * export const Damaged = 'Damaged';
 *
 * export type DamagedEvent = ActorEvent<{ amount: number }>;
 *
 * declare module 'dacha' {
 *   export interface ActorEventMap {
 *     [Damaged]: DamagedEvent;
 *   }
 * }
 * ```
 *
 * @see [Events](https://dachajs.org/concepts/events/)
 *
 * @category Events
 */
export interface ActorEventMap {}

/**
 * The events dispatched on the world, by name. Only the world gets typed
 * listeners for them.
 *
 * Add your own events to it with a `declare module 'dacha'` block. See
 * {@link ActorEventMap} for an example.
 *
 * @see [Events](https://dachajs.org/concepts/events/)
 *
 * @category Events
 */
export interface WorldEventMap {}
