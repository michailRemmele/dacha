import type { SceneLoadOptions, LevelLoadOptions } from '../scene';
import type { Actor } from '../actor';
import type { ActorEvent, SceneEvent } from '../../types/events';
import type { Event } from '../event-target';
import type { Entity } from '../entity';

export const AddChildEntity = 'AddChildEntity';
export const RemoveChildEntity = 'RemoveChildEntity';

export const AddActor = 'AddActor';
export const RemoveActor = 'RemoveActor';

export const LoadScene = 'LoadScene';
export const LoadLevel = 'LoadLevel';

export const AddComponent = 'AddComponent';
export const RemoveComponent = 'RemoveComponent';

export type AddChildEntityEvent = Event<Entity> & { child: Entity };
export type RemoveChildEntityEvent = Event<Entity> & { child: Entity };

export type AddComponentEvent = ActorEvent<{ componentName: string }>;
export type RemoveComponentEvent = ActorEvent<{ componentName: string }>;

export type AddActorEvent = SceneEvent<{ actor: Actor }>;
export type RemoveActorEvent = SceneEvent<{ actor: Actor }>;

export type LoadSceneEvent = SceneEvent<SceneLoadOptions>;

export type LoadLevelEvent = SceneEvent<LevelLoadOptions>;

export interface ActorCollectionEventMap {
  [AddActor]: AddActorEvent
  [RemoveActor]: RemoveActorEvent
}

export interface EntityEventMap {
  [AddChildEntity]: AddChildEntityEvent
  [RemoveChildEntity]: RemoveChildEntityEvent
}

declare module '../../types/events' {
  export interface SceneEventMap extends EntityEventMap {
    [LoadScene]: LoadSceneEvent
    [LoadLevel]: LoadLevelEvent
  }

  export interface ActorEventMap extends EntityEventMap {
    [AddComponent]: AddComponentEvent
    [RemoveComponent]: RemoveComponentEvent
  }
}
