import { SceneSystem } from '../../../engine/system';
import type { SceneSystemOptions, UpdateOptions } from '../../../engine/system';

import {
  PhysicsSubsystem,
  CollisionDetectionSubsystem,
  CollisionBroadcastSubsystem,
  CollisionSolver,
  ConstraintSolver,
} from './subsystems';

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
  private physicsSubsystem: PhysicsSubsystem;
  private collisionDetectionSubsystem: CollisionDetectionSubsystem;
  private collisionBroadcastSubsystem: CollisionBroadcastSubsystem;
  private collisionSolver: CollisionSolver;
  private constraintSolver: ConstraintSolver;

  constructor(options: SceneSystemOptions) {
    super();

    this.physicsSubsystem = new PhysicsSubsystem(options);
    this.collisionDetectionSubsystem = new CollisionDetectionSubsystem(options);
    this.collisionBroadcastSubsystem = new CollisionBroadcastSubsystem();
    this.collisionSolver = new CollisionSolver(options);
    this.constraintSolver = new ConstraintSolver();
  }

  onSceneDestroy(): void {
    this.physicsSubsystem.destroy();
    this.collisionDetectionSubsystem.destroy();
  }

  fixedUpdate(options: UpdateOptions): void {
    this.physicsSubsystem.update(options);

    const collisions = this.collisionDetectionSubsystem.update();

    this.collisionSolver.update(collisions);
    this.constraintSolver.update(collisions);
    this.collisionBroadcastSubsystem.update(collisions);
  }
}

PhysicsSystem.systemName = 'PhysicsSystem';
