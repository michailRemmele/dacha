import type { Actor } from '../../engine/actor';
import type { Vector2 } from '../../engine/math-lib';
import type {
  CustomMouseEvent,
  CustomKeyboardEvent,
} from '../types/input-events';
import type { ActorEvent, WorldEvent } from '../../types/events';

/**
 * Dispatched when game statistics are updated
 *
 * @event
 * @type {GameStatsUpdateEvent}
 *
 * @category Events
 */
export const GameStatsUpdate = 'GameStatsUpdate';

/**
 * Dispatched when keyboard input is received
 *
 * @event
 * @type {KeyboardInputEvent}
 *
 * @category Events
 */
export const KeyboardInput = 'KeyboardInput';

/**
 * Dispatched when mouse input is received
 *
 * @event
 * @type {MouseInputEvent}
 *
 * @category Events
 */
export const MouseInput = 'MouseInput';

/**
 * Dispatched when an actor enters a collision
 *
 * @event
 * @type {CollisionEnterEvent}
 *
 * @category Events
 */
export const CollisionEnter = 'CollisionEnter';

/**
 * Dispatched when an actor stays in collision
 *
 * @event
 * @type {CollisionStayEvent}
 *
 * @category Events
 */
export const CollisionStay = 'CollisionStay';

/**
 * Dispatched when an actor leaves a collision
 *
 * @event
 * @type {CollisionLeaveEvent}
 *
 * @category Events
 */
export const CollisionLeave = 'CollisionLeave';

/**
 * Dispatched when a character body hits a blocking actor
 *
 * @event
 * @type {CharacterHitEvent}
 *
 * @category Events
 */
export const CharacterHit = 'CharacterHit';

/** Event signature for the {@link MouseInput} event
 *
 * @category Events
 */
export type MouseInputEvent = WorldEvent<CustomMouseEvent>;

/** Event signature for the {@link KeyboardInput} event
 *
 * @category Events
 */
export type KeyboardInputEvent = WorldEvent<CustomKeyboardEvent>;

/** Event signature for the {@link GameStatsUpdate} event
 *
 * @category Events
 */
export type GameStatsUpdateEvent = WorldEvent<{
  /** Current frames per second */
  fps: number;
  /** Current number of actors in the scene */
  actorsCount: number;
}>;

/** Event signature for mouse control events
 *
 * @category Events
 */
export type MouseControlEvent<T = Record<string, never>> = ActorEvent<
  Pick<CustomMouseEvent, 'x' | 'y' | 'screenX' | 'screenY' | 'nativeEvent'>
> &
  T;

/** Event signature for keyboard control events
 *
 * @category Events
 */
export type KeyboardControlEvent<T = Record<string, never>> = ActorEvent<T>;

/** Base event signature for collision state events
 *
 * @category Events
 */
type CollisionStateEvent = ActorEvent<{
  /** Actor that is colliding with the target */
  actor: Actor;
  /** Collision normal pointing from the target actor to the colliding actor */
  normal: Vector2;
  /** Depth of penetration along the collision normal */
  penetration: number;
  /** Contact manifold points in world space */
  contactPoints: { x: number; y: number }[];
}>;

/** Event signature for the {@link CollisionEnter} event
 *
 * @category Events
 */
export type CollisionEnterEvent = CollisionStateEvent;

/** Event signature for the {@link CollisionStay} event
 *
 * @category Events
 */
export type CollisionStayEvent = CollisionStateEvent;

/** Event signature for the {@link CollisionLeave} event
 *
 * @category Events
 */
export type CollisionLeaveEvent = CollisionStateEvent;

/** Event signature for the {@link CharacterHit} event
 *
 * @category Events
 */
export type CharacterHitEvent = ActorEvent<{
  /** Actor hit by the character body */
  actor: Actor;
  /** Hit point in world space */
  point: { x: number; y: number };
  /** Hit normal pointing from the hit actor to the character */
  normal: Vector2;
  /** Distance from the cast origin to the hit */
  distance: number;
  /** Surface classification used by the character controller */
  kind: 'ground' | 'wall' | 'ceiling';
}>;

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
