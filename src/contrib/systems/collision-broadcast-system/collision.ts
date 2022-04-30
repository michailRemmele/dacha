import type { Entity } from '../../../engine/entity';

const STATE: Record<number, 'ENTER' | 'STAY' | 'LEAVE'> = {
  2: 'ENTER',
  1: 'STAY',
  0: 'LEAVE',
};

export class Collision {
  private lifetime: number;

  entity1: Entity;
  entity2: Entity;
  mtv1: unknown;
  mtv2: unknown;

  constructor(entity1: Entity, entity2: Entity, mtv1: unknown, mtv2: unknown) {
    this.entity1 = entity1;
    this.entity2 = entity2;
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

  getState(): 'ENTER' | 'STAY' | 'LEAVE' {
    return STATE[this.lifetime];
  }
}
