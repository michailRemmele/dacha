import type { Transform, TransformConfig } from '../';

import { LocalPoint } from './local-point';

export class LocalTransform {
  private transform: Transform;

  position: LocalPoint;
  scale: LocalPoint;

  private _rotation: number;

  constructor(config: TransformConfig, transform: Transform) {
    this.transform = transform;

    this.position = new LocalPoint(config.offsetX, config.offsetY, transform);
    this.scale = new LocalPoint(config.scaleX, config.scaleY, transform);

    this._rotation = config.rotation;
  }

  set rotation(val: number) {
    this._rotation = val;
    this.transform.markDirty();
  }

  get rotation(): number {
    return this._rotation;
  }
}
