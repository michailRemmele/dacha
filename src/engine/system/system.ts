/**
 * @module System
 * @category Core
 */
import type { ActorSpawner } from '../actor';
import type { TemplateCollection } from '../template';
import type { Scene } from '../scene';
import type { World } from '../world';
import type { Constructor } from '../../types/utils';

/**
 * Base options for all systems.
 */
interface SystemOptions extends Record<string, unknown> {
  /** Actor spawner for creating new actors */
  actorSpawner: ActorSpawner;
  /** Optional resources available to the system */
  resources?: unknown;
  /** Global engine options */
  globalOptions: Record<string, unknown>;
  /** Template collection for actor creation */
  templateCollection: TemplateCollection;
}

/**
 * Options for scene-level systems.
 */
export interface SceneSystemOptions extends SystemOptions {
  /** Scene this system operates on */
  scene: Scene;
  /** World containing the scene */
  world: World;
}

/**
 * Options for world-level systems.
 */
export interface WorldSystemOptions extends SystemOptions {
  /** World this system operates on */
  world: World;
}

/**
 * Options passed to update methods with timing information.
 */
export interface UpdateOptions {
  /** Time elapsed since last update in milliseconds */
  deltaTime: number;
}

/**
 * Abstract base class for all game systems.
 *
 * Systems are the core logic units that operate on scenes and actors.
 *
 * @example
 * ```typescript
 * class MovementSystem extends SceneSystem {
 *   private actorQuery: ActorQuery;
 *
 *   constructor(options: SceneSystemOptions) {
 *     super(options);
 *
 *     this.actorQuery = new ActorQuery({
 *       scene: options.scene,
 *       filter: [Transform, Velocity]
 *     });
 *   }
 *
 *   update({ deltaTime }: UpdateOptions): void {
 *     const actors = this.actorQuery.getActors();
 *
 *     for (const actor of actors) {
 *       const transform = actor.getComponent(Transform);
 *       const velocity = actor.getComponent(Velocity);
 *
 *       transform.world.position.x += velocity.x * deltaTime;
 *       transform.world.position.y += velocity.y * deltaTime;
 *     }
 *   }
 * }
 * ```
 * 
 * @category Core
 */
export abstract class System {
  /** Unique name identifier for the system */
  static systemName: string;

  /** Called when a scene is loaded. Used to load required resources for the system such as images, fonts, etc. */
  onSceneLoad?(scene: Scene): Promise<void>;
  /** Called when a scene becomes active */
  onSceneEnter?(scene: Scene): void;
  /** Called when a scene becomes inactive, but still remains in memory */
  onSceneExit?(scene: Scene): void;
  /** Called when a scene is destroyed */
  onSceneDestroy?(scene: Scene): void;
  /** Called every frame with variable timestep */
  update?(options: UpdateOptions): void;
  /** Called with fixed timestep for physics calculations */
  fixedUpdate?(options: UpdateOptions): void;
}

/**
 * Abstract base class for world-level systems.
 *
 * World systems operate at the global level and persist across scene changes.
 * They're typically used for core engine functionality like rendering, input, and audio.
 * 
 * @category Core
 */
export abstract class WorldSystem extends System {
  /** 
   * Called when the world is first loaded.
   * Used to load global resources such as bundle with game user interface
   */
  onWorldLoad?(world: World): Promise<void>;
  /** Called when all global resources are loaded */
  onWorldReady?(world: World): void;
  /** Called when the world is being destroyed */
  onWorldDestroy?(world: World): void;
}

/**
 * Abstract base class for scene-level systems.
 *
 * Scene systems operate within a specific scene and are created/destroyed
 * with the scene. They're typically used for game logic, AI, and scene-specific features.
 * 
 * @category Core
 */
export abstract class SceneSystem extends System {}

export type SystemConstructor = Constructor<System> & {
  systemName: string;
};
