import { Engine } from './engine';
import { Component } from './engine/component';
import { systems as contribSystems } from './contrib/systems';
import contribComponents from './contrib/components';
import IOC from './engine/ioc/ioc';
import { VectorOps, MathOps, Vector2 } from './engine/mathLib';
import { RESOURCES_LOADER_KEY_NAME } from './engine/consts/global';

export * from './engine/types';
export type {
  System,
  SystemOptions,
  UpdateOptions,
  HelperFn,
} from './engine/system';
export type {
  GameObject,
  GameObjectObserver,
  GameObjectObserverFilter,
  GameObjectSpawner,
  GameObjectDestroyer,
} from './engine/game-object';
export type { MessageBus, Message } from './engine/message-bus';
export type { Store, SceneContext } from './engine/scene';
export type { Script, ScriptOptions } from './contrib/systems/script-system';
export type { UiInitFnOptions, UiInitFn, UiDestroyFn } from './contrib/systems/ui-bridge';

export {
  Engine,
  Component,
  contribSystems,
  contribComponents,
  IOC,
  VectorOps,
  MathOps,
  Vector2,
  RESOURCES_LOADER_KEY_NAME,
};
