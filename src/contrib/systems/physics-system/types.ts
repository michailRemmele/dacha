import type { SceneSystemOptions } from '../../../engine/system';
import type { Actor } from '../../../engine/actor';
import type { Vector2, Point } from '../../../engine/math-lib';

export interface PhysicsSystemOptions extends SceneSystemOptions {
  gravity: number;
}

export interface CollisionLayer {
  id: string;
  name: string;
}

export type CollisionMatrix = Record<string, Record<string, boolean>>;

export interface PhysicsSettings {
  collisionLayers: CollisionLayer[];
  collisionMatrix: CollisionMatrix;
}

export interface PhysicsQueryFilter {
  layer?: string;
  excludeActors?: Actor[];
}

export interface CommonCastParams extends PhysicsQueryFilter {
  direction: Vector2;
  maxDistance: number;
}

export interface RaycastParams extends CommonCastParams {
  origin: Point;
}

export interface CastHit {
  actor: Actor;
  point: Point;
  normal: Vector2;
  distance: number;
}

export interface OverlapPointParams extends PhysicsQueryFilter {
  shape: {
    type: 'point';
    point: Point;
  };
}

export interface OverlapCircleParams extends PhysicsQueryFilter {
  shape: {
    type: 'circle';
    center: Point;
    radius: number;
  };
}

export interface OverlapBoxParams extends PhysicsQueryFilter {
  shape: {
    type: 'box';
    center: Point;
    size: Point;
    rotation?: number;
  };
}

export interface OverlapCapsuleParams extends PhysicsQueryFilter {
  shape: {
    type: 'capsule';
    center: Point;
    height: number;
    radius: number;
    rotation?: number;
  };
}

export type OverlapParams =
  | OverlapPointParams
  | OverlapCircleParams
  | OverlapBoxParams
  | OverlapCapsuleParams;

export interface CircleCastShape {
  type: 'circle';
  center: Point;
  radius: number;
}

export interface CapsuleCastShape {
  type: 'capsule';
  center: Point;
  height: number;
  radius: number;
}

export interface BoxCastShape {
  type: 'box';
  center: Point;
  size: Point;
}

export interface CircleCastParams extends PhysicsQueryFilter, CommonCastParams {
  shape: CircleCastShape;
}

export interface CapsuleCastParams
  extends PhysicsQueryFilter,
    CommonCastParams {
  shape: CapsuleCastShape;
}

export interface BoxCastParams extends PhysicsQueryFilter, CommonCastParams {
  shape: BoxCastShape;
}

export interface ShapeCastParams extends PhysicsQueryFilter, CommonCastParams {
  shape: CircleCastShape | CapsuleCastShape | BoxCastShape;
}

/**
 * Parameters for casting an actor's collider.
 *
 * Circle, box, and capsule colliders are supported. Segment colliders are not
 * castable and produce no hits.
 */
export interface CastActorParams extends PhysicsQueryFilter, CommonCastParams {
  /**
   * Actor whose components provide the cast geometry.
   */
  actor: Actor;
  /**
   * World-space offset added to the actor's geometry.
   */
  offset?: Point;
  /**
   * Collision layer used for filtering. When omitted, the actor collider's
   * layer is used.
   */
  layer?: string;
  /**
   * Whether to exclude the cast actor from query results. Defaults to `true`.
   */
  excludeSelf?: boolean;
}
