import type { Actor } from '../../../../../engine/actor';
import type { Vector2 } from '../../../../../engine/math-lib';
import type { Point } from '../collision-detection/types';

const STATE: Record<number, CollisionState> = {
  2: 'enter',
  1: 'stay',
  0: 'leave',
};

export type CollisionState = 'enter' | 'stay' | 'leave';

export class Collision {
  private lifetime: number;

  actor1: Actor;
  actor2: Actor;
  normal: Vector2;
  penetration: number;
  contactPoints: Point[];

  constructor(
    actor1: Actor,
    actor2: Actor,
    normal: Vector2,
    penetration: number,
    contactPoints: Point[],
  ) {
    this.actor1 = actor1;
    this.actor2 = actor2;
    this.lifetime = 2;
    this.normal = normal;
    this.penetration = penetration;
    this.contactPoints = contactPoints;
  }

  isFinished(): boolean {
    return this.lifetime < 0;
  }

  signal(): void {
    this.lifetime = 1;
  }

  tick(): void {
    this.lifetime -= this.lifetime || 1;
  }

  getState(): CollisionState {
    return STATE[this.lifetime];
  }
}
