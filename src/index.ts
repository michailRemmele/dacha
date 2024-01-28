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
  GameObjectObserverFilter,
  GameObjectSpawner,
  GameObjectDestroyer,
} from './engine/game-object';
export type {
  EventEmitter,
  Event,
  EventType,
  EventPayload,
  ListenerFn,
} from './engine/event-emitter';
export type { Scene, SceneContext } from './engine/scene';

export * as Animation from './contrib/components/animatable/types';

export { GameObject, GameObjectObserver, GameObjectCreator } from './engine/game-object';
export { TemplateCollection } from './engine/template';

export * from './types/events';
export * from './engine/events';
export * from './contrib/systems';
export * from './contrib/components';
export * from './contrib/events';

export {
  Engine,
  Component,
  VectorOps,
  MathOps,
  Vector2,
};
