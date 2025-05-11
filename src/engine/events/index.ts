import type { Actor } from '../actor';
import type { Scene } from '../scene';
import type { ActorEvent, SceneEvent, WorldEvent } from '../../types/events';
import type { Event } from '../event-target';
import type { Entity } from '../entity';

export const AddChildEntity = 'AddChildEntity';
export const RemoveChildEntity = 'RemoveChildEntity';

export const AddActor = 'AddActor';
export const RemoveActor = 'RemoveActor';

export const LoadScene = 'LoadScene';
export const EnterScene = 'EnterScene';
export const ExitScene = 'ExitScene';
export const DestroyScene = 'DestroyScene';

export const SceneLoaded = 'SceneLoaded';
export const SceneEntered = 'SceneEntered';
export const SceneExited = 'SceneExited';
export const SceneDestroyed = 'SceneDestroyed';

export const AddComponent = 'AddComponent';
export const RemoveComponent = 'RemoveComponent';

export type AddChildEntityEvent = Event<Entity> & { child: Entity };
export type RemoveChildEntityEvent = Event<Entity> & { child: Entity };

export type AddComponentEvent = ActorEvent<{ componentName: string }>;
export type RemoveComponentEvent = ActorEvent<{ componentName: string }>;

export type AddActorEvent = SceneEvent<{ actor: Actor }>;
export type RemoveActorEvent = SceneEvent<{ actor: Actor }>;

export type LoadSceneEvent = WorldEvent<{
  id: string
  autoEnter?: boolean
  autoDestroy?: boolean
}>;
export type EnterSceneEvent = WorldEvent<{
  id: string
  autoDestroy?: boolean
}>;
export type ExitSceneEvent = WorldEvent<{
  autoDestroy?: boolean
}>;
export type DestroySceneEvent = WorldEvent<{ id: string }>;
export type SceneLoadedEvent = WorldEvent<{ scene: Scene }>;
export type SceneEnteredEvent = WorldEvent<{ scene: Scene }>;
export type SceneExitedEvent = WorldEvent<{ scene: Scene }>;
export type SceneDestroyedEvent = WorldEvent<{ scene: Scene }>;

export interface ActorCollectionEventMap {
  [AddActor]: AddActorEvent
  [RemoveActor]: RemoveActorEvent
}

export interface EntityEventMap {
  [AddChildEntity]: AddChildEntityEvent
  [RemoveChildEntity]: RemoveChildEntityEvent
}

declare module '../../types/events' {
  export interface WorldEventMap extends EntityEventMap {
    [LoadScene]: LoadSceneEvent
    [EnterScene]: EnterSceneEvent
    [ExitScene]: ExitSceneEvent
    [DestroyScene]: DestroySceneEvent
    [SceneLoaded]: SceneLoadedEvent
    [SceneEntered]: SceneEnteredEvent
    [SceneExited]: SceneExitedEvent
    [SceneDestroyed]: SceneDestroyedEvent
  }

  export interface SceneEventMap extends EntityEventMap {}

  export interface ActorEventMap extends EntityEventMap {
    [AddComponent]: AddComponentEvent
    [RemoveComponent]: RemoveComponentEvent
  }
}
