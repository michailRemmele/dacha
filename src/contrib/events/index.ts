import type { Actor } from '../../engine/actor';
import type { Vector2 } from '../../engine/math-lib';
import type { CustomMouseEvent, CustomKeyboardEvent } from '../types/input-events';
import type { ActorEvent, SceneEvent } from '../../types/events';

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
export const PlayAudio = 'PlayAudio';
export const StopAudio = 'StopAudio';
export const SetAudioVolume = 'SetAudioVolume';

export type MouseInputEvent = SceneEvent<CustomMouseEvent>;

export type KeyboardInputEvent = SceneEvent<CustomKeyboardEvent>;

export type SetCameraEvent = SceneEvent<{
  actorId: string
}>;

export type GameStatsUpdateEvent = SceneEvent<{
  fps: number
  actorsCount: number
}>;

export type CollisionEvent = SceneEvent<{
  actor1: Actor
  actor2: Actor
  mtv1: Vector2
  mtv2: Vector2
}>;

export type SetAudioGroupVolumeEvent = SceneEvent<{
  group: string
  value: number
}>;

export type MouseControlEvent<T = Record<string, never>>
  = ActorEvent<Pick<CustomMouseEvent, 'x' | 'y' | 'screenX' | 'screenY' | 'nativeEvent'>> & T;

export type KeyboardControlEvent<T = Record<string, never>> = ActorEvent<T>;

type CollisionStateEvent = ActorEvent<{
  actor: Actor
  mtv: Vector2
}>;
export type CollisionEnterEvent = CollisionStateEvent;
export type CollisionStayEvent = CollisionStateEvent;
export type CollisionLeaveEvent = CollisionStateEvent;

export type AddForceEvent = ActorEvent<{
  value: Vector2
}>;

export type AddImpulseEvent = ActorEvent<{
  value: Vector2
}>;

export type SetAudioSourceVolumeEvent = ActorEvent<{
  value: number
}>;

declare module '../../types/events' {
  export interface SceneEventMap {
    [MouseInput]: MouseInputEvent
    [KeyboardInput]: KeyboardInputEvent
    [SetCamera]: SetCameraEvent
    [GameStatsUpdate]: GameStatsUpdateEvent
    [Collision]: CollisionEvent
    [SetAudioVolume]: SetAudioGroupVolumeEvent
  }

  export interface ActorEventMap {
    [CollisionEnter]: CollisionEnterEvent
    [CollisionStay]: CollisionStayEvent
    [CollisionLeave]: CollisionLeaveEvent
    [AddForce]: AddForceEvent
    [AddImpulse]: AddImpulseEvent
    [StopMovement]: ActorEvent
    [PlayAudio]: ActorEvent
    [StopAudio]: ActorEvent
    [SetAudioVolume]: SetAudioSourceVolumeEvent
  }
}
