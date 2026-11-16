import type { World, WorldListenerFn } from '../../../engine/world';
import type { Scene } from '../../../engine/scene';
import type { Actor } from '../../../engine/actor';
import type { Assets } from '../../../engine/asset';
import type { ComponentConstructor } from '../../../engine/component';
import type { EventType } from '../../../engine/event-target';

/**
 * A value the interface can read and follow. `subscribe` calls the listener with the
 * current value at once and again on every change, and returns a function that stops
 * it.
 *
 * @category Game UI
 */
export interface UIValue<T> {
  /** Returns the current value. */
  get(): T;
  /**
   * Calls `listener` with the current value now and on every change.
   *
   * @param listener - Receives the value.
   * @returns A function that stops the listener.
   */
  subscribe(listener: (value: T) => void): () => void;
}

/**
 * What a selector of {@link UIContext.watch} receives.
 *
 * @category Game UI
 */
export interface UISelectorTools {
  /** The active scene, or `undefined` between scenes. */
  scene: Scene | undefined;
  /**
   * Finds an actor of the active scene.
   *
   * @param filter - Components the actor must have.
   * @returns The first actor with all of them, or `undefined`.
   */
  find(filter: ComponentConstructor[]): Actor | undefined;
  /**
   * Finds the actors of the active scene.
   *
   * @param filter - Components the actors must have.
   * @returns A new array of the actors with all of them.
   */
  findAll(filter: ComponentConstructor[]): Actor[];
}

/**
 * What `onInit` of the interface module receives: the running game, as the interface
 * needs it.
 *
 * @typeParam O - The options of the bridge class, see {@link UIContext.options}.
 *
 * @category Game UI
 */
export interface UIContext<O = Record<string, unknown>> {
  /** The world. */
  world: World;
  /** The project assets. */
  assets: Assets;
  /**
   * The values of the fields a class that extends {@link UIBridge} declares with
   * {@link DefineField}, by field name.
   */
  options: O;
  /**
   * The active scene, or `undefined` between scenes. To follow it, use
   * `watch(({ scene }) => scene)`.
   */
  readonly scene: Scene | undefined;
  /**
   * Follows a value of the game. The bridge evaluates `selector` every frame while
   * the value has listeners, and reports it when it changes.
   *
   * @param selector - Reads the value.
   * @param equals - Compares two values. By default values are compared with
   * `Object.is`, and two arrays are equal when their items are.
   * @returns The value to read and follow.
   */
  watch<T>(
    selector: (tools: UISelectorTools) => T,
    equals?: (a: T, b: T) => boolean,
  ): UIValue<T>;
  /**
   * Listens for an event on the world. The listener is removed when the interface
   * is destroyed, if it was not removed before.
   *
   * @param type - The event type.
   * @param listener - Receives the event.
   * @returns A function that removes the listener.
   */
  on<T extends EventType>(type: T, listener: WorldListenerFn<T>): () => void;
}

/**
 * Starts the interface. {@link UIBridge} calls it when the world is ready.
 *
 * @category Game UI
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UIInitFn = (context: UIContext<any>) => void;

/**
 * Stops the interface. {@link UIBridge} calls it when the world is destroyed.
 *
 * @category Game UI
 */
export type UIDestroyFn = () => void;

/**
 * Loads the interface module. It usually is `() => import('./ui')`.
 *
 * @category Game UI
 */
export type LoadUIFn = () => Promise<{
  onInit: UIInitFn;
  onDestroy?: UIDestroyFn;
}>;
