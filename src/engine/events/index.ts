import type { SceneLoadOptions, LevelLoadOptions } from '../scene';
import type { GameObject } from '../game-object';
import type { GameObjectEvent, SceneEvent } from '../../types/events';

export const AddGameObject = 'AddGameObject';
export const RemoveGameObject = 'RemoveGameObject';

export const LoadScene = 'LoadScene';
export const LoadLevel = 'LoadLevel';

export const AddComponent = 'AddComponent';
export const RemoveComponent = 'RemoveComponent';

export type UpdateComponentEvent = GameObjectEvent<{
  componentName: string
}>;

export type UpdateGameObjectEvent = SceneEvent<{
  gameObject: GameObject
}>;

export type LoadSceneEvent = SceneEvent<SceneLoadOptions>;

export type LoadLevelEvent = SceneEvent<LevelLoadOptions>;

export interface GameObjectObserverEventMap {
  [AddGameObject]: UpdateGameObjectEvent
  [RemoveGameObject]: UpdateGameObjectEvent
}

declare module '../../types/events' {
  export interface SceneEventMap {
    [LoadScene]: LoadSceneEvent
    [LoadLevel]: LoadLevelEvent
    [AddGameObject]: UpdateGameObjectEvent
    [RemoveGameObject]: UpdateGameObjectEvent
  }

  export interface GameObjectEventMap {
    [AddComponent]: UpdateComponentEvent
    [RemoveComponent]: UpdateComponentEvent
  }
}
