import type { Transform } from '../';

export class WorldPosition {
  private transform: Transform;

  constructor(transform: Transform) {
    this.transform = transform;
  }

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
