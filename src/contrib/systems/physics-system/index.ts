import { SceneSystem } from '../../../engine/system';
import type { SceneSystemOptions, UpdateOptions } from '../../../engine/system';

import {
  PhysicsSubsystem,
  CollisionDetectionSubsystem,
  CollisionBroadcastSubsystem,
  CollisionSolver,
  ConstraintSolver,
} from './subsystems';

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
    this.collisionBroadcastSubsystem = new CollisionBroadcastSubsystem(options);
    this.collisionSolver = new CollisionSolver(options);
    this.constraintSolver = new ConstraintSolver(options);
  }

  onSceneDestroy(): void {
    this.physicsSubsystem.destroy();
    this.collisionDetectionSubsystem.destroy();
    this.collisionSolver.destroy();
    this.constraintSolver.destroy();
    this.collisionBroadcastSubsystem.destroy();
  }

  fixedUpdate(options: UpdateOptions): void {
    this.physicsSubsystem.update(options);
    this.collisionDetectionSubsystem.update();
    this.constraintSolver.update();
    this.collisionBroadcastSubsystem.update();
  }
}

PhysicsSystem.systemName = 'PhysicsSystem';
