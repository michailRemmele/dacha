import { Component } from '../../../engine/component';
import { Matrix, type Point } from '../../../engine/math-lib';

import { LocalTransform } from './local-transform';
import { WorldTransform } from './world-transform';

export type { LocalPoint } from './local-point';
export type { WorldPosition } from './world-position';
export type { WorldScale } from './world-scale';
export type { LocalTransform, WorldTransform };

/**
 * Options for {@link Transform}. All values are relative to the parent actor.
 *
 * @category Actors & Components
 */
export interface TransformConfig {
  /** The position. */
  offset: Point;
  /** The rotation, in degrees. */
  rotation: number;
  /** The scale. */
  scale: Point;
}

/**
 * The position, rotation and scale of an actor. Every actor has one.
 *
 * `local` holds the values relative to the parent actor. `world` holds the
 * values in the scene.
 *
 * @example
 * ```ts
 * const transform = actor.getComponent(Transform);
 * transform.world.position.x += 10;
 * ```
 *
 * @see [Actors](https://dachajs.org/concepts/actors/)
 *
 * @category Actors & Components
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
   *
   * @advanced
   */
  localMatrix: Matrix;

  /**
   * Matrix representing the world-space transformation.
   *
   * @advanced
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
   *
   * @advanced
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
   *
   * @advanced
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
   *
   * @advanced
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
   *
   * @advanced
   */
  get invertedWorldMatrix(): Matrix {
    this.updateWorldMatrix();

    if (this.invertedDirty) {
      this._invertedWorldMatrix.assign(this.worldMatrix).invert();
      this.invertedDirty = false;
    }

    return this._invertedWorldMatrix;
  }
}

Transform.componentName = 'Transform';
