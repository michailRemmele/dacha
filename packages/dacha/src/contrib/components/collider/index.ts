import { Component } from '../../../engine/component';
import type { Point } from '../../../engine/math-lib';

/**
 * The shape type of a {@link Collider}.
 *
 * @category Physics
 */
export type ColliderType = 'box' | 'circle' | 'segment' | 'capsule';

/**
 * Fields shared by every collider config.
 *
 * @category Physics
 */
export interface BaseColliderConfig {
  /** The shape type. It decides which size fields the config has. */
  type: ColliderType;
  offset: Point;
  layer: string;
  debugColor?: string;
  disabled: boolean;
}

/**
 * Options for a box collider.
 *
 * @category Physics
 */
export interface BoxColliderConfig extends BaseColliderConfig {
  type: 'box';
  /** The width and the height of the box. */
  size?: Point;
}

/**
 * Options for a circle collider.
 *
 * @category Physics
 */
export interface CircleColliderConfig extends BaseColliderConfig {
  type: 'circle';
  /** The radius of the circle. */
  radius?: number;
}

/**
 * Options for a segment collider: a line between two points.
 *
 * @category Physics
 */
export interface SegmentColliderConfig extends BaseColliderConfig {
  type: 'segment';
  /** The start of the segment, relative to the actor. */
  point1?: Point;
  /** The end of the segment, relative to the actor. */
  point2?: Point;
}

/**
 * Options for a vertical capsule collider.
 *
 * @category Physics
 */
export interface CapsuleColliderConfig extends BaseColliderConfig {
  type: 'capsule';
  /**
   * The distance between the centers of the two round ends. The full height is
   * `height + 2 * radius`.
   */
  height?: number;
  /** The radius of the round ends. */
  radius?: number;
}

/**
 * Options for {@link Collider}. The `type` field decides which variant it is.
 *
 * @category Physics
 */
export type ColliderConfig =
  | BoxColliderConfig
  | CircleColliderConfig
  | SegmentColliderConfig
  | CapsuleColliderConfig;

/**
 * The shape of a box collider.
 *
 * @category Physics
 */
export interface BoxColliderShape {
  type: 'box';
  /** The width and the height of the box. */
  size: Point;
}

/**
 * The shape of a circle collider.
 *
 * @category Physics
 */
export interface CircleColliderShape {
  type: 'circle';
  /** The radius of the circle. */
  radius: number;
}

/**
 * The shape of a segment collider.
 *
 * @category Physics
 */
export interface SegmentColliderShape {
  type: 'segment';
  /** The start of the segment, relative to the actor. */
  point1: Point;
  /** The end of the segment, relative to the actor. */
  point2: Point;
}

/**
 * The shape of a vertical capsule collider.
 *
 * @category Physics
 */
export interface CapsuleColliderShape {
  type: 'capsule';
  /** The distance between the centers of the two round ends. */
  height: number;
  /** The radius of the round ends. */
  radius: number;
}

/**
 * The shape of a {@link Collider}. The `type` field decides which variant it is.
 *
 * @category Physics
 */
export type ColliderShape =
  | BoxColliderShape
  | CircleColliderShape
  | SegmentColliderShape
  | CapsuleColliderShape;

/**
 * Gives an actor a shape for collisions: a box, a circle, a capsule or a
 * segment.
 *
 * @see [Collider](https://dachajs.org/systems/physics/bodies-and-colliders/#collider)
 *
 * @category Physics
 */
export class Collider extends Component {
  /** Moves the shape away from the position of the actor. */
  offset: Point;
  /**
   * The collision layer. Layers decide which colliders collide.
   *
   * @see [Collision layers](https://dachajs.org/systems/physics/collisions/#collision-layers)
   */
  layer: string;
  /** The color of the collider in the debug view of the editor. */
  debugColor?: string;
  /** Turns the collider off. */
  disabled: boolean;

  /** The shape and its size. */
  shape: ColliderShape;

  constructor(config: ColliderConfig) {
    super();

    this.offset = { x: config.offset.x, y: config.offset.y };
    this.layer = config.layer;
    this.debugColor = config.debugColor;
    this.disabled = config.disabled;

    switch (config.type) {
      case 'box':
        this.shape = {
          type: config.type,
          size: { x: config.size?.x ?? 0, y: config.size?.y ?? 0 },
        };
        break;
      case 'circle':
        this.shape = {
          type: config.type,
          radius: config.radius ?? 0,
        };
        break;
      case 'segment':
        this.shape = {
          type: config.type,
          point1: { x: config.point1?.x ?? 0, y: config.point1?.y ?? 0 },
          point2: { x: config.point2?.x ?? 0, y: config.point2?.y ?? 0 },
        };
        break;
      case 'capsule':
        this.shape = {
          type: config.type,
          height: config.height ?? 0,
          radius: config.radius ?? 0,
        };
    }
  }
}

Collider.componentName = 'Collider';
