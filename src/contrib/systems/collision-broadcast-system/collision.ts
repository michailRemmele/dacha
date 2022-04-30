import type { GameObject } from '../../../engine/game-object';

const STATE: Record<number, 'ENTER' | 'STAY' | 'LEAVE'> = {
  2: 'ENTER',
  1: 'STAY',
  0: 'LEAVE',
};

export class Collision {
  private lifetime: number;

  gameObject1: GameObject;
  gameObject2: GameObject;
  mtv1: unknown;
  mtv2: unknown;

  constructor(gameObject1: GameObject, gameObject2: GameObject, mtv1: unknown, mtv2: unknown) {
    this.gameObject1 = gameObject1;
    this.gameObject2 = gameObject2;
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
