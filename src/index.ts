import { Engine } from './engine';
import { Component } from './engine/component';
import { VectorOps, MathOps, Vector2 } from './engine/mathLib';

export * from './engine/types';
export type { ComponentsMap } from './engine/component';
export type {
  System,
  SystemOptions,
  SystemsMap,
  UpdateOptions,
  HelperFn,
} from './engine/system';
export type {
  GameObjectObserver,
  GameObjectObserverFilter,
  GameObjectSpawner,
  GameObjectDestroyer,
} from './engine/game-object';
export type { MessageBus, Message } from './engine/message-bus';
export type { Store, SceneContext } from './engine/scene';
export type { Script, ScriptOptions } from './contrib/systems/script-system';
export type { UiInitFnOptions, UiInitFn, UiDestroyFn } from './contrib/systems/ui-bridge';
export * as Animation from './contrib/components/animatable/types';

export { RendererService } from './contrib/systems/three-js-renderer';

export { GameObject, GameObjectCreator } from './engine/game-object';
export { TemplateCollection } from './engine/template';

export { contribSystems } from './contrib/systems';
export * from './contrib/components';

export {
  Engine,
  Component,
  VectorOps,
  MathOps,
  Vector2,
};
