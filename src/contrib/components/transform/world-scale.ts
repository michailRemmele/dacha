import type { Transform } from '../';

export class WorldScale {
  private transform: Transform;

  constructor(transform: Transform) {
    this.transform = transform;
  }

  set x(val: number) {
    const parent = this.transform.getParentComponent();

    if (!parent) {
      this.transform.local.scale.x = val;
      return;
    }

    parent.updateWorldMatrix();

    const parentScale = Math.hypot(parent.worldMatrix.a, parent.worldMatrix.b);
    this.transform.local.position.x = val / parentScale;
  }

  get x(): number {
    this.transform.updateWorldMatrix();
    return Math.hypot(
      this.transform.worldMatrix.a,
      this.transform.worldMatrix.b,
    );
  }

  set y(val: number) {
    const parent = this.transform.getParentComponent();

    if (!parent) {
      this.transform.local.scale.y = val;
      return;
    }

    parent.updateWorldMatrix();

    const parentScale = Math.hypot(parent.worldMatrix.c, parent.worldMatrix.d);
    this.transform.local.position.y = val / parentScale;
  }

  get y(): number {
    this.transform.updateWorldMatrix();
    return Math.hypot(
      this.transform.worldMatrix.c,
      this.transform.worldMatrix.d,
    );
  }
}
