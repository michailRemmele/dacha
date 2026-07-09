import type {
  Actor,
  ActorSpawner,
} from '../../../engine/actor';
import type { World } from '../../../engine/world';
import type { Scene } from '../../../engine/scene';
import type { UpdateContext, FixedUpdateContext } from '../../../engine/system';
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
  /** Update the behavior every frame with a variable timestep */
  update?(context: UpdateContext): void;
  /** Update the behavior with a fixed timestep, aligned with physics */
  fixedUpdate?(context: FixedUpdateContext): void;
}

/**
 * Constructor for all behaviors
 */
export type BehaviorConstructor = Constructor<Behavior> & { behaviorName: string };
