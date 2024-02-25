import type { SceneLoadOptions, LevelLoadOptions } from '../scene';
import type { GameObject } from '../game-object';
import type { GameObjectEvent, SceneEvent } from '../../types/events';
import type { Event } from '../event-target';
import type { BaseObject } from '../base-object';

export const AddChildObject = 'AddChildObject';
export const RemoveChildObject = 'RemoveChildObject';

export const AddGameObject = 'AddGameObject';
export const RemoveGameObject = 'RemoveGameObject';

export const LoadScene = 'LoadScene';
export const LoadLevel = 'LoadLevel';

export const AddComponent = 'AddComponent';
export const RemoveComponent = 'RemoveComponent';

export type AddChildObjectEvent = Event<BaseObject> & { child: BaseObject };
export type RemoveChildObjectEvent = Event<BaseObject> & { child: BaseObject };

export type AddComponentEvent = GameObjectEvent<{ componentName: string }>;
export type RemoveComponentEvent = GameObjectEvent<{ componentName: string }>;

export type AddGameObjectEvent = SceneEvent<{ gameObject: GameObject }>;
export type RemoveGameObjectEvent = SceneEvent<{ gameObject: GameObject }>;

export type LoadSceneEvent = SceneEvent<SceneLoadOptions>;

export type LoadLevelEvent = SceneEvent<LevelLoadOptions>;

export interface GameObjectObserverEventMap {
  [AddGameObject]: AddGameObjectEvent
  [RemoveGameObject]: RemoveGameObjectEvent
}

export interface BaseObjectEventMap {
  [AddChildObject]: AddChildObjectEvent
  [RemoveChildObject]: RemoveChildObjectEvent
}

declare module '../../types/events' {
  export interface SceneEventMap extends BaseObjectEventMap {
    [LoadScene]: LoadSceneEvent
    [LoadLevel]: LoadLevelEvent
  }

  export interface GameObjectEventMap extends BaseObjectEventMap {
    [AddComponent]: AddComponentEvent
    [RemoveComponent]: RemoveComponentEvent
  }
}
