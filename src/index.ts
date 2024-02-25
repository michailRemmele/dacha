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
  ActorCollectionFilter,
  ActorSpawner,
} from './engine/actor';
export type {
  EventTarget,
  Event,
  EventType,
  EventPayload,
  ListenerFn,
} from './engine/event-target';
export type { Scene } from './engine/scene';

export * as Animation from './contrib/components/animatable/types';

export { Actor, ActorCollection, ActorCreator } from './engine/actor';
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
