import type { Actor } from '../../engine/actor';
import type { World } from '../../engine/world';
import type { Event } from '../../engine/event-target';
import type { Vector } from '../../engine/math-lib';
import type {
  CustomMouseEvent,
  CustomKeyboardEvent,
} from '../types/input-events';
import type { ActorEvent } from '../../types/events';

/**
 * Game statistics are updated. See {@link GameStatsUpdateEvent}.
 *
 * @hidden
 */
export const GameStatsUpdate = 'GameStatsUpdate';

/**
 * A key goes down or up. See {@link KeyboardInputEvent}.
 *
 * @hidden
 */
export const KeyboardInput = 'KeyboardInput';

/**
 * A mouse event happens in the game window. See {@link MouseInputEvent}.
 *
 * @hidden
 */
export const MouseInput = 'MouseInput';

/**
 * Two colliders start to touch. See {@link CollisionEnterEvent}.
 *
 * @hidden
 */
export const CollisionEnter = 'CollisionEnter';

/**
 * Two colliders are still in contact. See {@link CollisionStayEvent}.
 *
 * @hidden
 */
export const CollisionStay = 'CollisionStay';

/**
 * Two colliders stop touching. See {@link CollisionLeaveEvent}.
 *
 * @hidden
 */
export const CollisionLeave = 'CollisionLeave';

/**
 * A character hits an obstacle. See {@link CharacterHitEvent}.
 *
 * @hidden
 */
export const CharacterHit = 'CharacterHit';

/**
 * {@link MouseInputSystem} dispatches it on the world for every mouse event in
 * the game window.
 *
 * Event name: `MouseInput` from `dacha/events`.
 *
 * @see [Reading raw input](https://dachajs.org/systems/input/#reading-raw-input)
 *
 * @category Input
 */
export interface MouseInputEvent extends Event<World>, CustomMouseEvent {}

/**
 * {@link KeyboardInputSystem} dispatches it on the world when a key goes down
 * or up. It includes the repeated `keydown` events of the browser.
 *
 * Event name: `KeyboardInput` from `dacha/events`.
 *
 * @see [Reading raw input](https://dachajs.org/systems/input/#reading-raw-input)
 *
 * @category Input
 */
export interface KeyboardInputEvent extends Event<World>, CustomKeyboardEvent {}

/**
 * {@link GameStatsMeter} dispatches it on the world, once per `frequency`
 * seconds.
 *
 * Event name: `GameStatsUpdate` from `dacha/events`.
 *
 * @category Game Stats
 */
export interface GameStatsUpdateEvent extends Event<World> {
  /** Frames per second. */
  fps: number;
  /** The number of actors in the scene. */
  actorsCount: number;
}

/**
 * An event that {@link MouseControlSystem} dispatches on an actor, for a
 * binding of its {@link MouseControl}. The name of the event is the
 * `eventType` of the binding.
 *
 * It has the pointer position: `x` and `y` in world coordinates, `screenX`
 * and `screenY` in pixels, and `nativeEvent`. See {@link CustomMouseEvent}.
 * `T` is the type of the `attrs` of the binding.
 *
 * @category Input
 */
export type MouseControlEvent<T = Record<string, never>> = ActorEvent<
  Pick<CustomMouseEvent, 'x' | 'y' | 'screenX' | 'screenY' | 'nativeEvent'>
> &
  T;

/**
 * An event that {@link KeyboardControlSystem} dispatches on an actor, for a
 * binding of its {@link KeyboardControl}. The name of the event is the
 * `eventType` of the binding. `T` is the type of the `attrs` of the binding.
 *
 * @category Input
 */
export type KeyboardControlEvent<T = Record<string, never>> = ActorEvent<T>;

/**
 * The fields of every collision event.
 *
 * @category Physics
 */
export interface CollisionEvent extends Event<Actor> {
  /** The other actor. */
  actor: Actor;
  /** The direction from `target` to the other actor. */
  normal: Vector;
  /** How deep the colliders overlap along `normal`, in world units. */
  penetration: number;
  /** The points where the colliders touch, in world space. One or two points. */
  contactPoints: { x: number; y: number }[];
}

/**
 * {@link PhysicsSystem} dispatches it on each of two actors when their
 * colliders start to touch.
 *
 * Event name: `CollisionEnter` from `dacha/events`.
 *
 * @see [Collisions](https://dachajs.org/systems/physics/collisions/)
 *
 * @category Physics
 */
export interface CollisionEnterEvent extends CollisionEvent {}

/**
 * {@link PhysicsSystem} dispatches it on each of two actors in every physics
 * step while their colliders are still in contact.
 *
 * Event name: `CollisionStay` from `dacha/events`.
 *
 * @see [Collisions](https://dachajs.org/systems/physics/collisions/)
 *
 * @category Physics
 */
export interface CollisionStayEvent extends CollisionEvent {}

/**
 * {@link PhysicsSystem} dispatches it on each of two actors when their
 * colliders stop touching.
 *
 * Event name: `CollisionLeave` from `dacha/events`.
 *
 * @see [Collisions](https://dachajs.org/systems/physics/collisions/)
 *
 * @category Physics
 */
export interface CollisionLeaveEvent extends CollisionEvent {}

/**
 * {@link CharacterController} dispatches it on the actor of a character for
 * every obstacle it hits.
 *
 * Event name: `CharacterHit` from `dacha/events`.
 *
 * @see [The CharacterHit event](https://dachajs.org/systems/character-controller/#the-characterhit-event)
 *
 * @category Character Controller
 */
export interface CharacterHitEvent extends Event<Actor> {
  /** The actor the character hit. */
  actor: Actor;
  /** The hit point, in world space. */
  point: { x: number; y: number };
  /** The direction from the hit surface to the character. */
  normal: Vector;
  /** The distance to the hit, from where this move started. */
  distance: number;
  /** `ground`, `wall` or `ceiling`. In the `free` motion mode, always `wall`. */
  kind: 'ground' | 'wall' | 'ceiling';
}

declare module '../../types/events' {
  export interface WorldEventMap {
    [MouseInput]: MouseInputEvent;
    [KeyboardInput]: KeyboardInputEvent;
    [GameStatsUpdate]: GameStatsUpdateEvent;
  }

  export interface ActorEventMap {
    [CollisionEnter]: CollisionEnterEvent;
    [CollisionStay]: CollisionStayEvent;
    [CollisionLeave]: CollisionLeaveEvent;
    [CharacterHit]: CharacterHitEvent;
  }
}
