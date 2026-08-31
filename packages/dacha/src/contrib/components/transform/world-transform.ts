import { MathOps } from '../../../engine/math-lib';
import type { Transform } from '../';

import { WorldPosition } from './world-position';
import { WorldScale } from './world-scale';

export class WorldTransform {
  private transform: Transform;

  /**
   * World-space position of the transform.
   */
  position: WorldPosition;

  /**
   * World-space scale of the transform.
   */
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

    const parentRotation = Math.atan2(
      parent.worldMatrix.b,
      parent.worldMatrix.a,
    );
    this.transform.local.rotation = val - parentRotation;
  }

  /**
   * World-space rotation of the transform in radians.
   */
  get rotation(): number {
    this.transform.updateWorldMatrix();
    return Math.atan2(
      this.transform.worldMatrix.b,
      this.transform.worldMatrix.a,
    );
  }

  set rotationDeg(val: number) {
    this.rotation = MathOps.degToRad(val);
  }

  /**
   * World-space rotation of the transform in degrees.
   */
  get rotationDeg(): number {
    return MathOps.radToDeg(this.rotation);
  }
}
