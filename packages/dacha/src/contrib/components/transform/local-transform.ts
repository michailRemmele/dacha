import { MathOps } from '../../../engine/math-lib';
import type { Transform, TransformConfig } from '../';

import { LocalPoint } from './local-point';

export class LocalTransform {
  private transform: Transform;

  /**
   * Local-space position relative to the parent transform.
   */
  position: LocalPoint;

  /**
   * Local-space scale relative to the parent transform.
   */
  scale: LocalPoint;

  private _rotation: number;

  constructor(config: TransformConfig, transform: Transform) {
    this.transform = transform;

    this.position = new LocalPoint(config.offsetX, config.offsetY, transform);
    this.scale = new LocalPoint(config.scaleX, config.scaleY, transform);

    this._rotation = MathOps.degToRad(config.rotation);
  }

  set rotation(val: number) {
    this._rotation = val;
    this.transform.markDirty();
  }

  /**
   * Local-space rotation in radians relative to the parent transform.
   */
  get rotation(): number {
    return this._rotation;
  }

  set rotationDeg(val: number) {
    this.rotation = MathOps.degToRad(val);
  }

  /**
   * Local-space rotation in degrees relative to the parent transform.
   */
  get rotationDeg(): number {
    return MathOps.radToDeg(this.rotation);
  }
}
