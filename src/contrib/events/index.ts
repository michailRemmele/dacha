import type { GameObject } from '../../engine/game-object';
import type { Vector2 } from '../../engine/mathLib';
import type { MouseEvent, KeyboardEvent } from '../types/input-events';
import type { GameObjectEvent, SceneEvent } from '../../types/events';

export const SetCamera = 'SetCamera';
export const GameStatsUpdate = 'GameStatsUpdate';
export const Collision = 'Collision';
export const KeyboardInput = 'KeyboardInput';
export const MouseInput = 'MouseInput';

export const CollisionEnter = 'CollisionEnter';
export const CollisionStay = 'CollisionStay';
export const CollisionLeave = 'CollisionLeave';
export const AddForce = 'AddForce';
export const AddImpulse = 'AddImpulse';
export const StopMovement = 'StopMovement';

export type MouseInputEvent = SceneEvent<MouseEvent>;

export type KeyboardInputEvent = SceneEvent<KeyboardEvent>;

export type SetCameraEvent = SceneEvent<{
  gameObjectId: string
}>;

export type GameStatsUpdateEvent = SceneEvent<{
  fps: number
  gameObjectsCount: number
}>;

export type CollisionEvent = SceneEvent<{
  gameObject1: GameObject
  gameObject2: GameObject
  mtv1: Vector2
  mtv2: Vector2
}>;

type CollisionStateEvent = GameObjectEvent<{
  gameObject: GameObject
  mtv: Vector2
}>;
export type CollisionEnterEvent = CollisionStateEvent;
export type CollisionStayEvent = CollisionStateEvent;
export type CollisionLeaveEvent = CollisionStateEvent;

export type AddForceEvent = GameObjectEvent<{
  value: Vector2
}>;

export type AddImpulseEvent = GameObjectEvent<{
  value: Vector2
}>;

declare module '../../types/events' {
  export interface SceneEventMap {
    [MouseInput]: MouseInputEvent
    [KeyboardInput]: KeyboardInputEvent
    [SetCamera]: SetCameraEvent
    [GameStatsUpdate]: GameStatsUpdateEvent
    [Collision]: CollisionEvent
  }

  export interface GameObjectEventMap {
    [CollisionEnter]: CollisionEnterEvent
    [CollisionStay]: CollisionStayEvent
    [CollisionLeave]: CollisionLeaveEvent
    [AddForce]: AddForceEvent
    [AddImpulse]: AddImpulseEvent
    [StopMovement]: GameObjectEvent
  }
}
