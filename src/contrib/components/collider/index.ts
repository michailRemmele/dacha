import { Component } from '../../../engine/component';
import type { Point } from '../../../engine/math-lib';

export interface ColliderConfig {
  type: 'box' | 'circle' | 'segment';
  centerX: number;
  centerY: number;
  sizeX?: number;
  sizeY?: number;
  point1X?: number;
  point1Y?: number;
  point2X?: number;
  point2Y?: number;
  radius?: number;
  layer: string;
  debugColor?: string;
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
 *   sizeY: 64,
 *   layer: 'default',
 * });
 *
 * // Create a circle collider
 * const circleCollider = new Collider({
 *   type: 'circle',
 *   centerX: 0,
 *   centerY: 0,
 *   radius: 32,
 *   layer: 'default',
 * });
 *
 * // Add to actor
 * actor.setComponent(boxCollider);
 * ```
 *
 * @category Components
 */
export class Collider extends Component {
  type: 'box' | 'circle' | 'segment';

  centerX: number;
  centerY: number;

  sizeX?: number;
  sizeY?: number;

  radius?: number;

  point1?: Point;
  point2?: Point;

  layer: string;

  debugColor?: string;

  constructor(config: ColliderConfig) {
    super();

    this.type = config.type;

    this.centerX = config.centerX;
    this.centerY = config.centerY;

    this.sizeX = config.sizeX;
    this.sizeY = config.sizeY;

    this.radius = config.radius;
    this.point1 =
      config.point1X !== undefined || config.point1Y !== undefined
        ? {
            x: config.point1X ?? 0,
            y: config.point1Y ?? 0,
          }
        : undefined;
    this.point2 =
      config.point2X !== undefined || config.point2Y !== undefined
        ? {
            x: config.point2X ?? 0,
            y: config.point2Y ?? 0,
          }
        : undefined;

    this.layer = config.layer;

    this.debugColor = config.debugColor;
  }

  clone(): Collider {
    return new Collider({
      type: this.type,
      centerX: this.centerX,
      centerY: this.centerY,
      sizeX: this.sizeX,
      sizeY: this.sizeY,
      radius: this.radius,
      point1X: this.point1?.x,
      point1Y: this.point1?.y,
      point2X: this.point2?.x,
      point2Y: this.point2?.y,
      layer: this.layer,
      debugColor: this.debugColor,
    });
  }
}

Collider.componentName = 'Collider';
