import type { Transform } from '../';
import { MathOps } from '../../../engine/math-lib';

import { WorldPosition } from './world-position';
import { WorldScale } from './world-scale';

export class WorldTransform {
  private transform: Transform;

  position: WorldPosition;
  scale: WorldScale;

  constructor(transform: Transform) {
    this.transform = transform;

    this.position = new WorldPosition(transform);
    this.scale = new WorldScale(transform);
  }

  set rotation(val: number) {
    const parent = this.transform.getParentComponent();

    if (!parent) {
      this.transform.local.rotation = val;
      return;
    }

    parent.updateWorldMatrix();

    const parentRotation = MathOps.radToDeg(
      Math.atan2(this.transform.worldMatrix.b, this.transform.worldMatrix.a),
    );
    this.transform.local.rotation = val - parentRotation;
  }

  get rotation(): number {
    this.transform.updateWorldMatrix();
    return MathOps.radToDeg(
      Math.atan2(this.transform.worldMatrix.b, this.transform.worldMatrix.a),
    );
  }
}
