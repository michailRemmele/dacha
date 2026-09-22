import type { Transform } from '../';

/**
 * The position of an actor in the scene. It is `transform.world.position`.
 *
 * Reading `x` or `y` computes the value from the parent actors. Setting it
 * changes the local position so that the world position gets the new value.
 *
 * @category Actors & Components
 */
export class WorldPosition {
  private transform: Transform;

  constructor(transform: Transform) {
    this.transform = transform;
  }

  /** The x value of the world position. */
  set x(val: number) {
    const parent = this.transform.getParentComponent();

    if (!parent) {
      this.transform.local.position.x = val;
      return;
    }

    parent.updateWorldMatrix();

    const local = parent.invertedWorldMatrix.apply({
      x: val,
      y: this.transform.world.position.y,
    });
    this.transform.local.position.x = local.x;
    this.transform.local.position.y = local.y;
  }

  get x(): number {
    this.transform.updateWorldMatrix();
    return this.transform.worldMatrix.tx;
  }

  /** The y value of the world position. */
  set y(val: number) {
    const parent = this.transform.getParentComponent();

    if (!parent) {
      this.transform.local.position.y = val;
      return;
    }

    parent.updateWorldMatrix();

    const local = parent.invertedWorldMatrix.apply({
      x: this.transform.world.position.x,
      y: val,
    });
    this.transform.local.position.x = local.x;
    this.transform.local.position.y = local.y;
  }

  get y(): number {
    this.transform.updateWorldMatrix();
    return this.transform.worldMatrix.ty;
  }
}
