import { System } from '../../../engine/system';
import type { SystemOptions, UpdateOptions } from '../../../engine/system';

import {
  PhysicsSubsystem,
  CollisionDetectionSubsystem,
  CollisionBroadcastSubsystem,
  CollisionSolver,
  ConstraintSolver,
} from './subsystems';

export class PhysicsSystem extends System {
  private physicsSubsystem: PhysicsSubsystem;
  private collisionDetectionSubsystem: CollisionDetectionSubsystem;
  private collisionBroadcastSubsystem: CollisionBroadcastSubsystem;
  private collisionSolver: CollisionSolver;
  private constraintSolver: ConstraintSolver;

  constructor(options: SystemOptions) {
    super();

    this.physicsSubsystem = new PhysicsSubsystem(options);
    this.collisionDetectionSubsystem = new CollisionDetectionSubsystem(options);
    this.collisionBroadcastSubsystem = new CollisionBroadcastSubsystem(options);
    this.collisionSolver = new CollisionSolver(options);
    this.constraintSolver = new ConstraintSolver(options);
  }

  mount(): void {
    this.physicsSubsystem.mount();
    this.collisionDetectionSubsystem.mount();
    this.collisionSolver.mount();
    this.constraintSolver.mount();
    this.collisionBroadcastSubsystem.mount();
  }

  unmount(): void {
    this.physicsSubsystem.unmount();
    this.collisionDetectionSubsystem.unmount();
    this.collisionSolver.unmount();
    this.constraintSolver.unmount();
    this.collisionBroadcastSubsystem.unmount();
  }

  update(options: UpdateOptions): void {
    this.physicsSubsystem.update(options);
    this.collisionDetectionSubsystem.update();
    this.constraintSolver.update();
    this.collisionBroadcastSubsystem.update();
  }
}

PhysicsSystem.systemName = 'PhysicsSystem';
