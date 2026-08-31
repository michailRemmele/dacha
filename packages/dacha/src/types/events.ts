import type { Event } from '../engine/event-target';
import type { Actor } from '../engine/actor';
import type { Scene } from '../engine/scene';
import type { World } from '../engine/world';

export type ActorEvent<T = Record<string, never>> = Event<Actor> & T;
export type SceneEvent<T = Record<string, never>> = Event<Scene> & T;
export type WorldEvent<T = Record<string, never>> = Event<World> & T;

export interface SceneEventMap {}

export interface ActorEventMap {}

export interface WorldEventMap {}
