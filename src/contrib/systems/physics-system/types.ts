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

export type ShapeCastParams =
  | CircleCastParams
  | CapsuleCastParams
  | BoxCastParams;
