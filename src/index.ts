import { Engine } from './engine';
import { Component } from './engine/component';
import IOC from './engine/ioc/ioc';
import { VectorOps, MathOps, Vector2 } from './engine/mathLib';
import { RESOURCES_LOADER_KEY_NAME } from './engine/consts/global';

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

export { GameObject, GameObjectCreator } from './engine/game-object';
export { TemplateCollection } from './engine/template';

export { contribSystems } from './contrib/systems';
export * from './contrib/components';

export {
  Engine,
  Component,
  IOC,
  VectorOps,
  MathOps,
  Vector2,
  RESOURCES_LOADER_KEY_NAME,
};
