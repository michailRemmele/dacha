import type {
  Actor,
  ActorSpawner,
} from '../../../engine/actor';
import type { World } from '../../../engine/world';
import type { Scene } from '../../../engine/scene';
import type { Constructor } from '../../../types/utils';

/**
 * Options for the behavior
 */
export interface BehaviorOptions {
  /** World instance */
  world: World
  /** Current scene instance */
  scene: Scene
  /** Actor that the behavior is applied to */
  actor: Actor
  /** Utility class for creating new actors */
  actorSpawner: ActorSpawner
  /** Global game options */
  globalOptions: Record<string, unknown>
}

/**
 * Options for the update method
 */
interface UpdateOptions {
  /** Time elapsed since the last update in milliseconds */
  deltaTime: number
}

/**
 * Base class for all behaviors
 *
 * Behaviors are the core logic units that operate on actors
 * and can be used to add custom behavior to actors
 */
export abstract class Behavior {
  /** Name of the behavior */
  static behaviorName: string;
  /** Destroy the behavior */
  destroy?(): void;
  /** Update the behavior */
  update?(options: UpdateOptions): void;
}

/**
 * Constructor for all behaviors
 */
export type BehaviorConstructor = Constructor<Behavior> & { behaviorName: string };
