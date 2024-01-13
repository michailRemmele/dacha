import type { Event } from '../engine/event-emitter';
import type { GameObject } from '../engine/game-object';
import type { Scene } from '../engine/scene';

export type GameObjectEvent<T = Record<string, never>> = Event<GameObject> & T;
export type SceneEvent<T = Record<string, never>> = Event<Scene> & T;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SceneEventMap {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GameObjectEventMap {}
