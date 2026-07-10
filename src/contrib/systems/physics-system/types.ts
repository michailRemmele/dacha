import type { SceneSystemOptions } from '../../../engine/system';
import type { Actor } from '../../../engine/actor';
import type { Vector2, Point } from '../../../engine/math-lib';

export interface PhysicsSystemOptions extends SceneSystemOptions {
  gravityX?: number;
  gravityY?: number;
  solverIterations?: number;
  linearSleepThreshold?: number;
  angularSleepThreshold?: number;
  sleepTimeThreshold?: number;
  maxAllowedPenetration?: number;
  maxBiasVelocity?: number;
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

export interface PhysicsQueryFilter<T> {
  layer?: string;
  excludeActors?: Actor[];
  actorFilter?: (actor: Actor) => boolean;
  hitFilter?: (hit: T) => boolean;
}

export interface CommonCastParams extends PhysicsQueryFilter<CastHit> {
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

export interface OverlapHit {
  actor: Actor;
  normal: Vector2;
  penetration: number;
  contactPoints: Point[];
}

export interface PointQueryShape {
  type: 'point';
  point: Point;
}

export interface CircleQueryShape {
  type: 'circle';
  center: Point;
  radius: number;
}

export interface CapsuleQueryShape {
  type: 'capsule';
  center: Point;
  height: number;
  radius: number;
  rotation?: number;
}

export interface BoxQueryShape {
  type: 'box';
  center: Point;
  size: Point;
  rotation?: number;
}

export interface OverlapPointParams extends PhysicsQueryFilter<OverlapHit> {
  shape: PointQueryShape;
}

export interface OverlapCircleParams extends PhysicsQueryFilter<OverlapHit> {
  shape: CircleQueryShape;
}

export interface OverlapBoxParams extends PhysicsQueryFilter<OverlapHit> {
  shape: BoxQueryShape;
}

export interface OverlapCapsuleParams extends PhysicsQueryFilter<OverlapHit> {
  shape: CapsuleQueryShape;
}

export type OverlapParams =
  | OverlapPointParams
  | OverlapCircleParams
  | OverlapBoxParams
  | OverlapCapsuleParams;

export interface OverlapActorParams extends PhysicsQueryFilter<OverlapHit> {
  /**
   * Actor whose components provide the overlap geometry.
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
   * Whether to exclude the overlap actor from query results. Defaults to `true`.
   */
  excludeSelf?: boolean;
}

export interface CircleCastParams extends CommonCastParams {
  shape: CircleQueryShape;
}

export interface CapsuleCastParams extends CommonCastParams {
  shape: CapsuleQueryShape;
}

export interface BoxCastParams extends CommonCastParams {
  shape: BoxQueryShape;
}

export interface ShapeCastParams extends CommonCastParams {
  shape: CircleQueryShape | CapsuleQueryShape | BoxQueryShape;
}

/**
 * Parameters for casting an actor's collider.
 *
 * Circle, box, and capsule colliders are supported. Segment colliders are not
 * castable and produce no hits.
 */
export interface CastActorParams extends CommonCastParams {
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
