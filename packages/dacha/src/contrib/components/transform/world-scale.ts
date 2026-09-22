import type { Transform } from '../';

/**
 * The scale of an actor in the scene. It is `transform.world.scale`.
 *
 * Reading `x` or `y` computes the value from the parent actors. Setting it
 * changes the local scale so that the world scale gets the new value.
 *
 * @category Actors & Components
 */
export class WorldScale {
  private transform: Transform;

  constructor(transform: Transform) {
    this.transform = transform;
  }

  /** The x value of the world scale. */
  set x(val: number) {
    const parent = this.transform.getParentComponent();

    if (!parent) {
      this.transform.local.scale.x = val;
      return;
    }

    parent.updateWorldMatrix();

    const parentScale = Math.hypot(parent.worldMatrix.a, parent.worldMatrix.b);
    this.transform.local.scale.x = val / parentScale;
  }

  get x(): number {
    this.transform.updateWorldMatrix();
    return Math.hypot(
      this.transform.worldMatrix.a,
      this.transform.worldMatrix.b,
    );
  }

  /** The y value of the world scale. */
  set y(val: number) {
    const parent = this.transform.getParentComponent();

    if (!parent) {
      this.transform.local.scale.y = val;
      return;
    }

    parent.updateWorldMatrix();

    const parentScale = Math.hypot(parent.worldMatrix.c, parent.worldMatrix.d);
    this.transform.local.scale.y = val / parentScale;
  }

  get y(): number {
    this.transform.updateWorldMatrix();
    return Math.hypot(
      this.transform.worldMatrix.c,
      this.transform.worldMatrix.d,
    );
  }
}
