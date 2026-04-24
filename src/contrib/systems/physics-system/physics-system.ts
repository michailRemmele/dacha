import { SceneSystem } from '../../../engine/system';
import type { SceneSystemOptions, UpdateOptions } from '../../../engine/system';
import type { World } from '../../../engine/world';

import {
  PhysicsSubsystem,
  CollisionDetectionSubsystem,
  CollisionBroadcastSubsystem,
  ConstraintSolver,
} from './subsystems';
import { PhysicsAPI } from './api';

/**
 * Physics system that handles 2D physics simulation and collision detection
 *
 * Manages rigid body physics and collision detection and resolution.
 *
 * @extends SceneSystem
 *
 * @category Systems
 */
export class PhysicsSystem extends SceneSystem {
  private world: World;
  private physicsSubsystem: PhysicsSubsystem;
  private collisionDetectionSubsystem: CollisionDetectionSubsystem;
  private collisionBroadcastSubsystem: CollisionBroadcastSubsystem;
  private constraintSolver: ConstraintSolver;
  private physicsApi: PhysicsAPI;

  constructor(options: SceneSystemOptions) {
    super();

    this.world = options.world;
    this.physicsSubsystem = new PhysicsSubsystem(options);
    this.collisionDetectionSubsystem = new CollisionDetectionSubsystem(options);
    this.collisionBroadcastSubsystem = new CollisionBroadcastSubsystem();
    this.constraintSolver = new ConstraintSolver();
    this.physicsApi = new PhysicsAPI(this.collisionDetectionSubsystem);
  }

  onSceneEnter(): void {
    this.world.systemApi.register(this.physicsApi);
  }

  onSceneExit(): void {
    this.world.systemApi.unregister(PhysicsAPI);
  }

  onSceneDestroy(): void {
    this.world.systemApi.unregister(PhysicsAPI);
    this.physicsSubsystem.destroy();
    this.collisionDetectionSubsystem.destroy();
  }

  fixedUpdate(options: UpdateOptions): void {
    this.physicsSubsystem.update(options);

    const contacts = this.collisionDetectionSubsystem.update();

    this.constraintSolver.update(contacts);
    this.collisionBroadcastSubsystem.update(contacts);
  }
}

PhysicsSystem.systemName = 'PhysicsSystem';
