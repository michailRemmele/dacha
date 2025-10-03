import { Component } from '../../../engine/component';

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
 * console.log(`Position: ${transform.offsetX}, ${transform.offsetY}`);
 * console.log(`Rotation: ${transform.rotation}`);
 * console.log(`Scale: ${transform.scaleX}, ${transform.scaleY}`);
 * ```
 *
 * @category Components
 */
export class Transform extends Component {
  /**
   * Relative X position of the actor.
   */
  relativeOffsetX: number;
  /**
   * Relative offset Y position of the actor.
   */
  relativeOffsetY: number;
  /**
   * Relative rotation of the actor.
   */
  relativeRotation: number;
  /**
   * Relative scale X factor of the actor.
   */
  relativeScaleX: number;
  /**
   * Relative scale Y factor of the actor.
   */
  relativeScaleY: number;

  /**
   * Creates a new Transform component.
   *
   * @param config - Configuration for the transform
   */
  constructor(config: TransformConfig) {
    super();

    this.relativeOffsetX = config.offsetX;
    this.relativeOffsetY = config.offsetY;
    this.relativeRotation = config.rotation;
    this.relativeScaleX = config.scaleX || 1;
    this.relativeScaleY = config.scaleY || 1;
  }

  _getPropertyFromParent(name: string, defaultValue: number): number {
    const parentComponent = this.getParentComponent() as
      | Record<string, number>
      | undefined;
    return parentComponent ? parentComponent[name] : defaultValue;
  }

  /**
   * Sets the world X position of the actor.
   * @param offsetX - World X position
   */
  set offsetX(offsetX) {
    this.relativeOffsetX = offsetX - this._getPropertyFromParent('offsetX', 0);
  }

  /**
   * Gets the world X position of the actor.
   * @returns World X position
   */
  get offsetX(): number {
    return this.relativeOffsetX + this._getPropertyFromParent('offsetX', 0);
  }

  /**
   * Sets the world Y position of the actor.
   * @param offsetY - World Y position
   */
  set offsetY(offsetY) {
    this.relativeOffsetY = offsetY - this._getPropertyFromParent('offsetY', 0);
  }

  /**
   * Gets the world Y position of the actor.
   * @returns World Y position
   */
  get offsetY(): number {
    return this.relativeOffsetY + this._getPropertyFromParent('offsetY', 0);
  }

  /**
   * Sets the world rotation of the actor in degrees.
   * @param rotation - World rotation in degrees
   */
  set rotation(rotation) {
    this.relativeRotation =
      rotation - this._getPropertyFromParent('rotation', 0);
  }

  /**
   * Gets the world rotation of the actor in degrees.
   * @returns World rotation in degrees
   */
  get rotation(): number {
    return this.relativeRotation + this._getPropertyFromParent('rotation', 0);
  }

  /**
   * Sets the X scale factor of the actor.
   * @param scaleX - X scale factor
   */
  set scaleX(scaleX) {
    this.relativeScaleX = scaleX / this._getPropertyFromParent('scaleX', 1);
  }

  /**
   * Gets the X scale factor of the actor.
   * @returns X scale factor
   */
  get scaleX(): number {
    return this.relativeScaleX * this._getPropertyFromParent('scaleX', 1);
  }

  /**
   * Sets the Y scale factor of the actor.
   * @param scaleY - Y scale factor
   */
  set scaleY(scaleY) {
    this.relativeScaleY = scaleY / this._getPropertyFromParent('scaleY', 1);
  }

  /**
   * Gets the Y scale factor of the actor.
   * @returns Y scale factor
   */
  get scaleY(): number {
    return this.relativeScaleY * this._getPropertyFromParent('scaleY', 1);
  }

  clone(): Transform {
    return new Transform({
      offsetX: this.relativeOffsetX,
      offsetY: this.relativeOffsetY,
      rotation: this.relativeRotation,
      scaleX: this.relativeScaleX,
      scaleY: this.relativeScaleY,
    });
  }
}

Transform.componentName = 'Transform';
