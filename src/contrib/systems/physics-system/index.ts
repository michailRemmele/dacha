import { System } from '../../../engine/system';
import type { SystemOptions, UpdateOptions } from '../../../engine/system';
import type { MessageBus } from '../../../engine/message-bus';

import {
  PhysicsSubsystem,
  CollisionDetectionSubsystem,
  CollisionBroadcastSubsystem,
  CollisionSolver,
  ConstraintSolver,
} from './subsystems';

const COLLISION_MESSAGES = [
  'COLLISION_ENTER',
  'COLLISION_STAY',
  'COLLISION_LEAVE',
];

export class PhysicsSystem extends System {
  private messageBus: MessageBus;

  private physicsSubsystem: PhysicsSubsystem;
  private collisionDetectionSubsystem: CollisionDetectionSubsystem;
  private collisionBroadcastSubsystem: CollisionBroadcastSubsystem;
  private collisionSolver: CollisionSolver;
  private constraintSolver: ConstraintSolver;

  constructor(options: SystemOptions) {
    super();

    this.messageBus = options.messageBus;

    this.physicsSubsystem = new PhysicsSubsystem(options);
    this.collisionDetectionSubsystem = new CollisionDetectionSubsystem(options);
    this.collisionBroadcastSubsystem = new CollisionBroadcastSubsystem(options);
    this.collisionSolver = new CollisionSolver(options);
    this.constraintSolver = new ConstraintSolver(options);
  }

  mount(): void {
    this.physicsSubsystem.mount();
    this.collisionDetectionSubsystem.mount();
    this.collisionBroadcastSubsystem.mount();
  }

  unmount(): void {
    this.physicsSubsystem.unmount?.();
    this.collisionDetectionSubsystem.unmount?.();
    this.collisionBroadcastSubsystem.unmount?.();
  }

  update(options: UpdateOptions): void {
    COLLISION_MESSAGES.forEach((message) => {
      this.messageBus.delete(message);
    });

    this.physicsSubsystem.update(options);
    this.collisionDetectionSubsystem.update();
    this.collisionBroadcastSubsystem.update();
    this.collisionSolver.update();
    this.constraintSolver.update();
  }
}

PhysicsSystem.systemName = 'PhysicsSystem';
