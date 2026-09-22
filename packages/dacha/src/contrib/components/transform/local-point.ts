import type { Transform } from '../';

/**
 * A position or a scale relative to the parent actor. It is
 * `transform.local.position` and `transform.local.scale`.
 *
 * Changing `x` or `y` updates the world values of the actor and its children.
 *
 * @category Actors & Components
 */
export class LocalPoint {
  private transform: Transform;

  private _x: number;
  private _y: number;

  constructor(x: number, y: number, transform: Transform) {
    this.transform = transform;

    this._x = x;
    this._y = y;
  }

  /** The x value. */
  set x(val: number) {
    this._x = val;
    this.transform.markDirty();
  }

  get x(): number {
    return this._x;
  }

  /** The y value. */
  set y(val: number) {
    this._y = val;
    this.transform.markDirty();
  }

  get y(): number {
    return this._y;
  }
}
