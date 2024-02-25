import type { Actor } from '../../../../../engine/actor';
import type { Vector2 } from '../../../../../engine/mathLib';

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
  mtv1: Vector2;
  mtv2: Vector2;

  constructor(actor1: Actor, actor2: Actor, mtv1: Vector2, mtv2: Vector2) {
    this.actor1 = actor1;
    this.actor2 = actor2;
    this.lifetime = 2;
    this.mtv1 = mtv1;
    this.mtv2 = mtv2;
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
