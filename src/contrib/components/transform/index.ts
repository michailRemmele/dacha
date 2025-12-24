import { Component } from '../../../engine/component';
import { Matrix, MathOps } from '../../../engine/math-lib';

import { LocalTransform } from './local-transform';
import { WorldTransform } from './world-transform';

export interface TransformConfig {
  offsetX: number;
  offsetY: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

/**
 * Transform component that handles position, rotation, and scale of an actor.
 *
 * Component provides hierarchical transformation support, meaning
 * child actors inherit transformations from their parents. All values are
 * stored as relative to the parent, but accessed as world coordinates.
 *
 * @example
 * ```typescript
 * // Create a transform for an actor
 * const transform = new Transform({
 *   offsetX: 100,
 *   offsetY: 50,
 *   rotation: 45,
 *   scaleX: 1.5,
 *   scaleY: 1.0
 * });
 *
 * // Add to actor
 * actor.setComponent(transform);
 *
 * // Access world coordinates
 * console.log(`Position: ${transform.world.position.x}, ${transform.world.position.y}`);
 * console.log(`Rotation: ${transform.world.rotation}`);
 * console.log(`Scale: ${transform.world.scale.x}, ${transform.world.scale.y}`);
 * ```
 *
 * @category Components
 */
export class Transform extends Component {
  local: LocalTransform;
  world: WorldTransform;

  localMatrix: Matrix;
  worldMatrix: Matrix;
  invertedWorldMatrix: Matrix;

  private dirty: boolean;

  /**
   * Creates a new Transform component.
   *
   * @param config - Configuration for the transform
   */
  constructor(config: TransformConfig) {
    super();

    this.local = new LocalTransform(config, this);
    this.world = new WorldTransform(this);

    this.localMatrix = new Matrix(1, 0, 0, 1, 0, 0);
    this.worldMatrix = new Matrix(1, 0, 0, 1, 0, 0);
    this.invertedWorldMatrix = new Matrix(1, 0, 0, 1, 0, 0);

    this.dirty = true;
  }

  override getParentComponent(): Transform | undefined {
    return super.getParentComponent() as Transform | undefined;
  }

  markDirty(): void {
    if (this.dirty) {
      return;
    }

    this.dirty = true;

    this.actor?.children.forEach((child) => {
      const childTransform = child.getComponent(Transform);
      childTransform.markDirty();
    });
  }

  updateLocalMatrix(): void {
    const rad = MathOps.degToRad(this.local.rotation);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    this.localMatrix.assign(
      cos * this.local.scale.x,
      sin * this.local.scale.x,
      -sin * this.local.scale.y,
      cos * this.local.scale.y,
      this.local.position.x,
      this.local.position.y,
    );
  }

  updateWorldMatrix(): void {
    if (!this.dirty) {
      return;
    }

    this.updateLocalMatrix();

    const parent = this.getParentComponent();

    if (!parent) {
      this.worldMatrix.assign(this.localMatrix);
    } else {
      parent.updateWorldMatrix();
      Matrix.multiply(this.worldMatrix, parent.worldMatrix, this.localMatrix);
    }

    this.invertedWorldMatrix.assign(this.worldMatrix).invert();

    this.dirty = false;
  }

  clone(): Transform {
    return new Transform({
      offsetX: this.local.position.x,
      offsetY: this.local.position.y,
      rotation: this.local.rotation,
      scaleX: this.local.scale.x,
      scaleY: this.local.scale.y,
    });
  }
}

Transform.componentName = 'Transform';
