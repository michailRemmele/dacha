import type { Actor } from '../actor';
import type { Scene } from '../scene';
import type { ActorEvent, SceneEvent, WorldEvent } from '../../types/events';
import type { Event } from '../event-target';
import type { Entity } from '../entity';

/**
 * Dispatched when a child entity is added
 * 
 * @event
 * @type {AddChildEntityEvent}
 * 
 * @category Core Events
 */
export const AddChildEntity = 'AddChildEntity';
/**
 * Dispatched when a child entity is removed
 * 
 * @event
 * @type {RemoveChildEntityEvent}
 * 
 * @category Core Events
 */
export const RemoveChildEntity = 'RemoveChildEntity';

/**
 * Dispatched when an actor is added
 * 
 * @event
 * @type {AddActorEvent}
 * 
 * @category Core Events
 */
export const AddActor = 'AddActor';
/**
 * Dispatched when an actor is removed
 * 
 * @event
 * @type {RemoveActorEvent}
 * 
 * @category Core Events
 */
export const RemoveActor = 'RemoveActor';

/**
 * Dispatched to load a scene
 * 
 * @event
 * @type {LoadSceneEvent}
 * 
 * @category Core Events
 */
export const LoadScene = 'LoadScene';
/**
 * Dispatched to enter a scene
 * 
 * @event
 * @type {EnterSceneEvent}
 * 
 * @category Core Events
 */
export const EnterScene = 'EnterScene';
/**
 * Dispatched to exit a scene
 * 
 * @event
 * @type {ExitSceneEvent}
 * 
 * @category Core Events
 */
export const ExitScene = 'ExitScene';
/**
 * Dispatched to destroy a scene
 * 
 * @event
 * @type {DestroySceneEvent}
 * 
 * @category Core Events
 */
export const DestroyScene = 'DestroyScene';

/**
 * Dispatched when a scene is loaded
 * 
 * @event
 * @type {SceneLoadedEvent}
 * 
 * @category Core Events
 */
export const SceneLoaded = 'SceneLoaded'; 
/**
 * Dispatched when a scene is entered
 * 
 * @event
 * @type {SceneEnteredEvent}
 * 
 * @category Core Events
 */
export const SceneEntered = 'SceneEntered';
/**
 * Dispatched when a scene is exited
 * 
 * @event
 * @type {SceneExitedEvent}
 * 
 * @category Core Events
 */
export const SceneExited = 'SceneExited';
/**
 * Dispatched when a scene is destroyed
 * 
 * @event
 * @type {SceneDestroyedEvent}
 * 
 * @category Core Events
 */
export const SceneDestroyed = 'SceneDestroyed';

/**
 * Dispatched when a component is added
 * 
 * @event
 * @type {AddComponentEvent}
 * 
 * @category Core Events
 */
export const AddComponent = 'AddComponent';
/**
 * Dispatched when a component is removed
 * 
 * @event
 * @type {RemoveComponentEvent}
 * 
 * @category Core Events
 */
export const RemoveComponent = 'RemoveComponent';

/**
 * Event signature for the {@link AddChildEntity} event
 * 
 * @category Core Events
 */
export type AddChildEntityEvent = Event<Entity> & {
  /** Child entity that was added */
  child: Entity;
};
/**
 * Event signature for the {@link RemoveChildEntity} event
 * 
 * @category Core Events
 */
export type RemoveChildEntityEvent = Event<Entity> & {
  /** Child entity that was removed */
  child: Entity;
};

/**
 * Event signature for the {@link AddComponent} event
 * 
 * @category Core Events
 */
export type AddComponentEvent = ActorEvent<{
  /** Name of the component that was added */
  componentName: string;
}>;
/**
 * Event signature for the {@link RemoveComponent} event
 * 
 * @category Core Events
 */
export type RemoveComponentEvent = ActorEvent<{
  /** Name of the component that was removed */
  componentName: string;
}>;

/**
 * Event signature for the {@link AddActor} event
 * 
 * @category Core Events
 */
export type AddActorEvent = SceneEvent<{
  /** Actor that was added */
  actor: Actor;
}>;
/**
 * Event signature for the {@link RemoveActor} event
 * 
 * @category Core Events
 */
export type RemoveActorEvent = SceneEvent<{
  /** Actor that was removed */
  actor: Actor;
}>;

/**
 * Event signature for the {@link LoadScene} event
 * 
 * @category Core Events
 */
export type LoadSceneEvent = WorldEvent<{
  /** Id of the scene */
  id: string;
  /**
   * Whether to automatically enter the scene after loading
   *
   * @default true
   */
  autoEnter?: boolean;
  /**
   * Whether to automatically destroy the previous scene after loading
   *
   * Works only if loaded scene is auto entered
   *
   * @default true
   */
  autoDestroy?: boolean;
}>;

/**
 * Event signature for the {@link EnterScene} event
 * 
 * @category Core Events
 */
export type EnterSceneEvent = WorldEvent<{
  /** Id of the scene */
  id: string;
  /**
   * Whether to automatically destroy the previous scene after entering
   *
   * @default true
   */
  autoDestroy?: boolean;
}>;

/**
 * Event signature for the {@link ExitScene} event
 * 
 * @category Core Events
 */
export type ExitSceneEvent = WorldEvent<{
  /**
   * Whether to automatically destroy the scene after exiting
   *
   * @default true
   */
  autoDestroy?: boolean;
}>;

/**
 * Event signature for the {@link DestroyScene} event
 * 
 * @category Core Events
 */
export type DestroySceneEvent = WorldEvent<{
  /** Id of the scene */
  id: string;
}>;

/**
 * Event signature for the {@link SceneLoaded} event
 * 
 * @category Core Events
 */
export type SceneLoadedEvent = WorldEvent<{
  /** Scene that was loaded */
  scene: Scene;
}>;

/**
 * Event signature for the {@link SceneEntered} event
 * 
 * @category Core Events
 */
export type SceneEnteredEvent = WorldEvent<{
  /** Scene that was entered */
  scene: Scene;
}>;

/**
 * Event signature for the {@link SceneExited} event
 * 
 * @category Core Events
 */
export type SceneExitedEvent = WorldEvent<{
  /** Scene that was exited */
  scene: Scene;
}>;

/**
 * Event signature for the {@link SceneDestroyed} event
 * 
 * @category Core Events
 */
export type SceneDestroyedEvent = WorldEvent<{
  /** Scene that was destroyed */
  scene: Scene;
}>;

export interface ActorCollectionEventMap {
  [AddActor]: AddActorEvent;
  [RemoveActor]: RemoveActorEvent;
}

export interface EntityEventMap {
  [AddChildEntity]: AddChildEntityEvent;
  [RemoveChildEntity]: RemoveChildEntityEvent;
}

declare module '../../types/events' {
  export interface WorldEventMap extends EntityEventMap {
    [LoadScene]: LoadSceneEvent;
    [EnterScene]: EnterSceneEvent;
    [ExitScene]: ExitSceneEvent;
    [DestroyScene]: DestroySceneEvent;
    [SceneLoaded]: SceneLoadedEvent;
    [SceneEntered]: SceneEnteredEvent;
    [SceneExited]: SceneExitedEvent;
    [SceneDestroyed]: SceneDestroyedEvent;
  }

  export interface SceneEventMap extends EntityEventMap {}

  export interface ActorEventMap extends EntityEventMap {
    [AddComponent]: AddComponentEvent;
    [RemoveComponent]: RemoveComponentEvent;
  }
}
