import { Component } from '../../../engine/component';
import type { Point } from '../../../engine/math-lib';

export type ColliderType = 'box' | 'circle' | 'segment' | 'capsule';

export interface BaseColliderConfig {
  type: ColliderType;
  offset: Point;
  layer: string;
  debugColor?: string;
}

export interface BoxColliderConfig extends BaseColliderConfig {
  type: 'box';
  size: Point;
}

export interface CircleColliderConfig extends BaseColliderConfig {
  type: 'circle';
  radius: number;
}

export interface SegmentColliderConfig extends BaseColliderConfig {
  type: 'segment';
  point1: Point;
  point2: Point;
}

export interface CapsuleColliderConfig extends BaseColliderConfig {
  type: 'capsule';
  point1: Point;
  point2: Point;
  radius: number;
}

export type ColliderConfig =
  | BoxColliderConfig
  | CircleColliderConfig
  | SegmentColliderConfig
  | CapsuleColliderConfig;

export type ColliderShape =
  | Pick<BoxColliderConfig, 'type' | 'size'>
  | Pick<CircleColliderConfig, 'type' | 'radius'>
  | Pick<SegmentColliderConfig, 'type' | 'point1' | 'point2'>
  | Pick<CapsuleColliderConfig, 'type' | 'point1' | 'point2' | 'radius'>;

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
 *   offset: { x: 0, y: 0 },
 *   size: { x: 64, y: 64 },
 *   layer: 'default',
 * });
 *
 * // Create a circle collider
 * const circleCollider = new Collider({
 *   type: 'circle',
 *   offset: { x: 0, y: 0 },
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
  offset: Point;
  layer: string;
  debugColor?: string;

  shape: ColliderShape;

  constructor(config: ColliderConfig) {
    super();

    this.offset = { ...config.offset };
    this.layer = config.layer;
    this.debugColor = config.debugColor;

    switch (config.type) {
      case 'box':
        this.shape = {
          type: config.type,
          size: { ...config.size },
        };
        break;
      case 'circle':
        this.shape = {
          type: config.type,
          radius: config.radius,
        };
        break;
      case 'segment':
        this.shape = {
          type: config.type,
          point1: { ...config.point1 },
          point2: { ...config.point2 },
        };
        break;
      case 'capsule':
        this.shape = {
          type: config.type,
          point1: { ...config.point1 },
          point2: { ...config.point2 },
          radius: config.radius,
        };
    }
  }

  clone(): Collider {
    const baseConfig = {
      offset: { ...this.offset },
      layer: this.layer,
      debugColor: this.debugColor,
    };

    switch (this.shape.type) {
      case 'box':
        return new Collider({
          ...baseConfig,
          type: this.shape.type,
          size: { ...this.shape.size },
        });
      case 'circle':
        return new Collider({
          ...baseConfig,
          type: this.shape.type,
          radius: this.shape.radius,
        });
      case 'segment':
        return new Collider({
          ...baseConfig,
          type: this.shape.type,
          point1: { ...this.shape.point1 },
          point2: { ...this.shape.point2 },
        });
      case 'capsule':
        return new Collider({
          ...baseConfig,
          type: this.shape.type,
          point1: { ...this.shape.point1 },
          point2: { ...this.shape.point2 },
          radius: this.shape.radius,
        });
    }
  }
}

Collider.componentName = 'Collider';
