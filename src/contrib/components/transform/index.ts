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
 * Component responsible for handling local and world-space transforms.
 *
 * A Transform manages position, rotation, and scale, and computes
 * corresponding transformation matrices. It supports hierarchical
 * parent-child relationships via world matrix composition.
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
 * console.log(`Rotation (in radians): ${transform.world.rotation}`);
 * console.log(`Scale: ${transform.world.scale.x}, ${transform.world.scale.y}`);
 * ```
 *
 * @category Components
 */
export class Transform extends Component {
  /**
   * Local-space transform values (position, rotation, scale).
   * These values are relative to the parent transform.
   */
  local: LocalTransform;

  /**
   * World-space transform values derived from the local transform
   * and the parent hierarchy.
   */
  world: WorldTransform;

  /**
   * Matrix representing the local-space transformation.
   */
  localMatrix: Matrix;

  /**
   * Matrix representing the world-space transformation.
   */
  worldMatrix: Matrix;

  private _invertedWorldMatrix: Matrix;

  private dirty: boolean;
  private invertedDirty: boolean;

  /**
   * Creates a new Transform component.
   *
   * @param config - Initial configuration for position, rotation, and scale.
   */
  constructor(config: TransformConfig) {
    super();

    this.local = new LocalTransform(config, this);
    this.world = new WorldTransform(this);

    this.localMatrix = new Matrix(1, 0, 0, 1, 0, 0);
    this.worldMatrix = new Matrix(1, 0, 0, 1, 0, 0);
    this._invertedWorldMatrix = new Matrix(1, 0, 0, 1, 0, 0);

    this.dirty = true;
    this.invertedDirty = true;
  }

  /**
   * Returns the parent Transform component, if one exists.
   *
   * @returns The parent Transform or `undefined` if this transform has no parent.
   */
  override getParentComponent(): Transform | undefined {
    return super.getParentComponent() as Transform | undefined;
  }

  /**
   * Marks this transform and all descendant transforms as dirty.
   *
   * This signals that their matrices must be recalculated before use.
   */
  markDirty(): void {
    if (this.dirty) {
      return;
    }

    this.dirty = true;
    this.invertedDirty = true;

    this.actor?.children.forEach((child) => {
      const childTransform = child.getComponent(Transform);
      childTransform.markDirty();
    });
  }

  /**
   * Recomputes the local transformation matrix from local position,
   * rotation, and scale.
   */
  updateLocalMatrix(): void {
    const cos = Math.cos(this.local.rotation);
    const sin = Math.sin(this.local.rotation);

    this.localMatrix.assign(
      cos * this.local.scale.x,
      sin * this.local.scale.x,
      -sin * this.local.scale.y,
      cos * this.local.scale.y,
      this.local.position.x,
      this.local.position.y,
    );
  }

  /**
   * Recomputes the world transformation matrix if the transform is dirty.
   *
   * This method ensures parent transforms are updated first and then
   * composes the local matrix with the parent world matrix.
   */
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

    this.dirty = false;
  }

  /**
   * Inverse of the world transformation matrix.
   * Useful for converting world-space coordinates to local space.
   */
  get invertedWorldMatrix(): Matrix {
    this.updateWorldMatrix();

    if (this.invertedDirty) {
      this._invertedWorldMatrix.assign(this.worldMatrix).invert();
      this.invertedDirty = false;
    }

    return this._invertedWorldMatrix;
  }

  clone(): Transform {
    return new Transform({
      offsetX: this.local.position.x,
      offsetY: this.local.position.y,
      rotation: MathOps.radToDeg(this.local.rotation),
      scaleX: this.local.scale.x,
      scaleY: this.local.scale.y,
    });
  }
}

Transform.componentName = 'Transform';
