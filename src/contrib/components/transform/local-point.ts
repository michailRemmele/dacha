import type { Transform } from '../';

export class LocalPoint {
  private transform: Transform;

  private _x: number;
  private _y: number;

  constructor(x: number, y: number, transform: Transform) {
    this.transform = transform;

    this._x = x;
    this._y = y;
  }

  set x(val: number) {
    this._x = val;
    this.transform.markDirty();
  }

  get x(): number {
    return this._x;
  }

  set y(val: number) {
    this._y = val;
    this.transform.markDirty();
  }

  get y(): number {
    return this._y;
  }
}
