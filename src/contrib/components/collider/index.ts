import { Component } from '../../../engine/component';
import type { Point } from '../../../engine/math-lib';

export type ColliderType = 'box' | 'circle' | 'segment' | 'capsule';

export interface BaseColliderConfig {
  type: ColliderType;
  offsetX: number;
  offsetY: number;
  layer: string;
  debugColor?: string;
}

export interface BoxColliderConfig extends BaseColliderConfig {
  type: 'box';
  sizeX: number;
  sizeY: number;
}

export interface CircleColliderConfig extends BaseColliderConfig {
  type: 'circle';
  radius: number;
}

export interface SegmentColliderConfig extends BaseColliderConfig {
  type: 'segment';
  point1X: number;
  point1Y: number;
  point2X: number;
  point2Y: number;
}

export interface CapsuleColliderConfig extends BaseColliderConfig {
  type: 'capsule';
  point1X: number;
  point1Y: number;
  point2X: number;
  point2Y: number;
  radius: number;
}

export type ColliderConfig =
  | BoxColliderConfig
  | CircleColliderConfig
  | SegmentColliderConfig
  | CapsuleColliderConfig;

export interface BoxColliderShape {
  type: 'box';
  size: Point;
}

export interface CircleColliderShape {
  type: 'circle';
  radius: number;
}

export interface SegmentColliderShape {
  type: 'segment';
  point1: Point;
  point2: Point;
}

export interface CapsuleColliderShape {
  type: 'capsule';
  point1: Point;
  point2: Point;
  radius: number;
}

export type ColliderShape =
  | BoxColliderShape
  | CircleColliderShape
  | SegmentColliderShape
  | CapsuleColliderShape;

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
 *   offsetX: 0,
 *   offsetY: 0,
 *   sizeX: 64,
 *   sizeY: 64,
 *   layer: 'default',
 * });
 *
 * // Create a circle collider
 * const circleCollider = new Collider({
 *   type: 'circle',
 *   offsetX: 0,
 *   offsetY: 0,
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

    this.offset = { x: config.offsetX, y: config.offsetY };
    this.layer = config.layer;
    this.debugColor = config.debugColor;

    switch (config.type) {
      case 'box':
        this.shape = {
          type: config.type,
          size: { x: config.sizeX, y: config.sizeY },
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
          point1: { x: config.point1X, y: config.point1Y },
          point2: { x: config.point2X, y: config.point2Y },
        };
        break;
      case 'capsule':
        this.shape = {
          type: config.type,
          point1: { x: config.point1X, y: config.point1Y },
          point2: { x: config.point2X, y: config.point2Y },
          radius: config.radius,
        };
    }
  }
}

Collider.componentName = 'Collider';
