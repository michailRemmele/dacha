import type { Actor } from '../../engine/actor';
import type { Vector2 } from '../../engine/math-lib';
import type { CustomMouseEvent, CustomKeyboardEvent } from '../types/input-events';
import type { ActorEvent, SceneEvent, WorldEvent } from '../../types/events';

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

export type MouseInputEvent = WorldEvent<CustomMouseEvent>;

export type KeyboardInputEvent = WorldEvent<CustomKeyboardEvent>;

export type GameStatsUpdateEvent = WorldEvent<{ fps: number, actorsCount: number }>;

export type SetAudioGroupVolumeEvent = WorldEvent<{ group: string, value: number }>;

export type CollisionEvent = SceneEvent<{
  actor1: Actor
  actor2: Actor
  mtv1: Vector2
  mtv2: Vector2
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
  export interface WorldEventMap {
    [MouseInput]: MouseInputEvent
    [KeyboardInput]: KeyboardInputEvent
    [GameStatsUpdate]: GameStatsUpdateEvent
    [SetAudioVolume]: SetAudioGroupVolumeEvent
  }

  export interface SceneEventMap {
    [Collision]: CollisionEvent
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
