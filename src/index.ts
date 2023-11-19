import { Engine } from './engine';
import { Component } from './engine/component';
import { VectorOps, MathOps, Vector2 } from './engine/mathLib';

export * from './engine/types';
export { System } from './engine/system';
export type {
  SystemOptions,
  UpdateOptions,
} from './engine/system';
export type {
  GameObjectObserver,
  GameObjectObserverFilter,
  GameObjectSpawner,
  GameObjectDestroyer,
} from './engine/game-object';
export type { MessageBus, Message } from './engine/message-bus';
export type { SceneContext } from './engine/scene';
export type { GameObjectScript, GameObjectScriptOptions } from './contrib/systems/script-system';
export type { UiInitFnOptions, UiInitFn, UiDestroyFn } from './contrib/systems/ui-bridge';
export * as Animation from './contrib/components/animatable/types';

export { GameObject, GameObjectCreator } from './engine/game-object';
export { TemplateCollection } from './engine/template';

export * from './contrib/systems';
export * from './contrib/components';

export {
  Engine,
  Component,
  VectorOps,
  MathOps,
  Vector2,
};
