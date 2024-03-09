import type { Event } from '../engine/event-target';
import type { Actor } from '../engine/actor';
import type { Scene } from '../engine/scene';

export type ActorEvent<T = Record<string, never>> = Event<Actor> & T;
export type SceneEvent<T = Record<string, never>> = Event<Scene> & T;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SceneEventMap {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ActorEventMap {}
