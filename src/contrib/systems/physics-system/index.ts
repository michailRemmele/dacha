import type { System, SystemOptions, UpdateOptions } from '../../../engine/system';
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

export class PhysicsSystem implements System {
  private messageBus: MessageBus;

  private physicsSubsystem: System;
  private collisionDetectionSubsystem: System;
  private collisionBroadcastSubsystem: System;
  private collisionSolver: System;
  private constraintSolver: System;

  constructor(options: SystemOptions) {
    this.messageBus = options.messageBus;

    this.physicsSubsystem = new PhysicsSubsystem(options);
    this.collisionDetectionSubsystem = new CollisionDetectionSubsystem(options);
    this.collisionBroadcastSubsystem = new CollisionBroadcastSubsystem(options);
    this.collisionSolver = new CollisionSolver(options);
    this.constraintSolver = new ConstraintSolver(options);
  }

  mount(): void {
    this.physicsSubsystem.mount?.();
    this.collisionDetectionSubsystem.mount?.();
    this.collisionBroadcastSubsystem.mount?.();
    this.collisionSolver.mount?.();
    this.constraintSolver.mount?.();
  }

  unmount(): void {
    this.physicsSubsystem.unmount?.();
    this.collisionDetectionSubsystem.unmount?.();
    this.collisionBroadcastSubsystem.unmount?.();
    this.collisionSolver.unmount?.();
    this.constraintSolver.unmount?.();
  }

  update(options: UpdateOptions): void {
    COLLISION_MESSAGES.forEach((message) => {
      this.messageBus.delete(message);
    });

    this.physicsSubsystem.update(options);
    this.collisionDetectionSubsystem.update(options);
    this.collisionBroadcastSubsystem.update(options);
    this.collisionSolver.update(options);
    this.constraintSolver.update(options);
  }
}
