import type { Actor, ActorQuery } from '../actor';
import type { Scene } from '../scene';
import type { World } from '../world';
import type { Event } from '../event-target';
import type { Entity } from '../entity';
import type { Component } from '../component';

/**
 * @internal The engine announces a new child on an entity with it.
 */
export const AddChildEntity = 'AddChildEntity';
/**
 * @internal The engine announces a removed child on an entity with it.
 */
export const RemoveChildEntity = 'RemoveChildEntity';

/**
 * An actor starts matching an {@link ActorQuery}. See {@link AddActorEvent}.
 *
 * @hidden
 */
export const AddActor = 'AddActor';
/**
 * An actor stops matching an {@link ActorQuery}. See {@link RemoveActorEvent}.
 *
 * @hidden
 */
export const RemoveActor = 'RemoveActor';

/**
 * Loads a scene. See {@link LoadSceneEvent}.
 *
 * @hidden
 */
export const LoadScene = 'LoadScene';
/**
 * Makes a loaded scene the active one. See {@link EnterSceneEvent}.
 *
 * @hidden
 */
export const EnterScene = 'EnterScene';
/**
 * Leaves the active scene. See {@link ExitSceneEvent}.
 *
 * @hidden
 */
export const ExitScene = 'ExitScene';
/**
 * Destroys a loaded scene. See {@link DestroySceneEvent}.
 *
 * @hidden
 */
export const DestroyScene = 'DestroyScene';

/**
 * A scene and its systems are ready. See {@link SceneLoadedEvent}.
 *
 * @hidden
 */
export const SceneLoaded = 'SceneLoaded';
/**
 * A scene has become the active scene. See {@link SceneEnteredEvent}.
 *
 * @hidden
 */
export const SceneEntered = 'SceneEntered';
/**
 * A scene has stopped being the active scene. See {@link SceneExitedEvent}.
 *
 * @hidden
 */
export const SceneExited = 'SceneExited';
/**
 * A scene has been destroyed. See {@link SceneDestroyedEvent}.
 *
 * @hidden
 */
export const SceneDestroyed = 'SceneDestroyed';

/**
 * @internal The engine announces a new component on an actor with it.
 */
export const AddComponent = 'AddComponent';
/**
 * @internal The engine announces a removed component on an actor with it.
 */
export const RemoveComponent = 'RemoveComponent';

/** @internal */
export interface AddChildEntityEvent extends Event<Entity> {
  /** Child entity that was added */
  child: Entity;
}
/** @internal */
export interface RemoveChildEntityEvent extends Event<Entity> {
  /** Child entity that was removed */
  child: Entity;
}

/** @internal */
export interface AddComponentEvent extends Event<Actor> {
  /** Component instance */
  component: Component;
  /** Name of the component */
  name: string;
}
/** @internal */
export interface RemoveComponentEvent extends Event<Actor> {
  /** Component instance */
  component: Component;
  /** Name of the component */
  name: string;
}

/**
 * An actor starts matching an {@link ActorQuery}: it gets the components of
 * the filter, or it is added to the scene with them.
 *
 * The query dispatches it on itself, immediately. Listen on the query, not on
 * the scene.
 *
 * Event name: `AddActor` from `dacha/events`.
 *
 * @example
 * ```ts
 * query.addEventListener(AddActor, ({ actor }) => {
 *   // set up the new actor
 * });
 * ```
 *
 * @category Events
 */
export interface AddActorEvent extends Event<ActorQuery> {
  /** The actor that started matching the query. */
  actor: Actor;
}
/**
 * An actor stops matching an {@link ActorQuery}: it loses a component of the
 * filter, or it is removed from the scene.
 *
 * The query dispatches it on itself, immediately. Listen on the query, not on
 * the scene.
 *
 * Event name: `RemoveActor` from `dacha/events`.
 *
 * @category Events
 */
export interface RemoveActorEvent extends Event<ActorQuery> {
  /** The actor that stopped matching the query. */
  actor: Actor;
}

/**
 * Loads a scene: builds its actors and systems, then enters it. Dispatch it on
 * the world.
 *
 * The change is queued. Wait for {@link SceneEnteredEvent | SceneEntered} if
 * you need to know when the switch is done.
 *
 * Event name: `LoadScene` from `dacha/events`.
 *
 * @example
 * ```ts
 * world.dispatchEvent(LoadScene, { id: LEVEL_TWO_SCENE_ID });
 * ```
 *
 * @see [Scenes and world](https://dachajs.org/concepts/scenes-and-world/)
 *
 * @category Events
 */
export interface LoadSceneEvent extends Event<World> {
  /** The id of the scene to load. */
  id: string;
  /**
   * Enters the scene after it is loaded. Set it to `false` to preload a scene
   * and enter it later with {@link EnterSceneEvent | EnterScene}.
   *
   * @defaultValue `true`
   */
  autoEnter?: boolean;
  /**
   * Destroys the scene you leave. Set it to `false` to keep it loaded, so you
   * can return to it without rebuilding it. It has an effect only when the new
   * scene is entered.
   *
   * @defaultValue `true`
   */
  autoDestroy?: boolean;
}

/**
 * Makes an already loaded scene the active one. Dispatch it on the world.
 *
 * Event name: `EnterScene` from `dacha/events`.
 *
 * @category Events
 */
export interface EnterSceneEvent extends Event<World> {
  /** The id of the scene to enter. */
  id: string;
  /**
   * Destroys the scene you leave.
   *
   * @defaultValue `true`
   */
  autoDestroy?: boolean;
}

/**
 * Leaves the active scene, leaving no scene active. Dispatch it on the world.
 *
 * Event name: `ExitScene` from `dacha/events`.
 *
 * @category Events
 */
export interface ExitSceneEvent extends Event<World> {
  /**
   * Destroys the scene you leave.
   *
   * @defaultValue `true`
   */
  autoDestroy?: boolean;
}

/**
 * Destroys a loaded scene. Dispatch it on the world.
 *
 * Event name: `DestroyScene` from `dacha/events`.
 *
 * @category Events
 */
export interface DestroySceneEvent extends Event<World> {
  /** The id of the scene to destroy. */
  id: string;
}

/**
 * The world dispatches it when a scene and its systems are ready.
 *
 * Event name: `SceneLoaded` from `dacha/events`.
 *
 * @category Events
 */
export interface SceneLoadedEvent extends Event<World> {
  /** The scene that was loaded. */
  scene: Scene;
}

/**
 * The world dispatches it when a scene has become the active scene.
 *
 * Event name: `SceneEntered` from `dacha/events`.
 *
 * @category Events
 */
export interface SceneEnteredEvent extends Event<World> {
  /** The scene that was entered. */
  scene: Scene;
}

/**
 * The world dispatches it when a scene has stopped being the active scene.
 *
 * Event name: `SceneExited` from `dacha/events`.
 *
 * @category Events
 */
export interface SceneExitedEvent extends Event<World> {
  /** The scene that was exited. */
  scene: Scene;
}

/**
 * The world dispatches it when a scene has been destroyed.
 *
 * Event name: `SceneDestroyed` from `dacha/events`.
 *
 * @category Events
 */
export interface SceneDestroyedEvent extends Event<World> {
  /** The scene that was destroyed. */
  scene: Scene;
}

/**
 * The events of {@link ActorQuery}: an actor starts or stops matching the query.
 *
 * @category Events
 */
export interface ActorQueryEventMap {
  [AddActor]: AddActorEvent;
  [RemoveActor]: RemoveActorEvent;
}

/** @internal The events every entity gets when its children change. */
export interface EntityEventMap {
  /** @internal */
  [AddChildEntity]: AddChildEntityEvent;
  /** @internal */
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
    /** @internal */
    [AddComponent]: AddComponentEvent;
    /** @internal */
    [RemoveComponent]: RemoveComponentEvent;
  }
}
