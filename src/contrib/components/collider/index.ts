import { Component } from '../../../engine/component';

export interface ColliderConfig {
  type: 'box' | 'circle';
  centerX: number;
  centerY: number;
  sizeX?: number;
  sizeY?: number;
  radius?: number;
}

/**
 * Collider component for defining collision boundaries.
 *
 * Collider component defines the collision shape for an actor. It's used by the
 * physics system to detect collisions between actors.
 *
 * @example
 * ```typescript
 * // Create a box collider
 * const boxCollider = new Collider({
 *   type: 'box',
 *   centerX: 0,
 *   centerY: 0,
 *   sizeX: 64,
 *   sizeY: 64
 * });
 *
 * // Create a circle collider
 * const circleCollider = new Collider({
 *   type: 'circle',
 *   centerX: 0,
 *   centerY: 0,
 *   radius: 32
 * });
 *
 * // Add to actor
 * actor.setComponent(boxCollider);
 * ```
 * 
 * @category Components
 */
export class Collider extends Component {
  type: 'box' | 'circle';

  centerX: number;
  centerY: number;

  sizeX?: number;
  sizeY?: number;

  radius?: number;

  constructor(config: ColliderConfig) {
    super();

    this.type = config.type;

    this.centerX = config.centerX;
    this.centerY = config.centerY;

    this.sizeX = config.sizeX;
    this.sizeY = config.sizeY;

    this.radius = config.radius;
  }

  clone(): Collider {
    return new Collider({
      type: this.type,
      centerX: this.centerX,
      centerY: this.centerY,
      sizeX: this.sizeX,
      sizeY: this.sizeY,
      radius: this.radius,
    });
  }
}

Collider.componentName = 'Collider';
