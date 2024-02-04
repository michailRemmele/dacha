import type { SceneLoadOptions, LevelLoadOptions } from '../scene';
import type { GameObject } from '../game-object';
import type { GameObjectEvent, SceneEvent } from '../../types/events';

export const AddGameObject = 'AddGameObject';
export const RemoveGameObject = 'RemoveGameObject';

export const LoadScene = 'LoadScene';
export const LoadLevel = 'LoadLevel';

export const AddComponent = 'AddComponent';
export const RemoveComponent = 'RemoveComponent';

export const Destroy = 'Destroy';

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

declare module '../../types/events' {
  export interface SceneEventMap {
    [LoadScene]: LoadSceneEvent
    [LoadLevel]: LoadLevelEvent
    [AddGameObject]: AddGameObjectEvent
    [RemoveGameObject]: RemoveGameObjectEvent
  }

  export interface GameObjectEventMap {
    [AddComponent]: AddComponentEvent
    [RemoveComponent]: RemoveComponentEvent
    [Destroy]: GameObjectEvent
  }
}
