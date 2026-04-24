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

export interface RaycastParams extends PhysicsQueryFilter {
  origin: Point;
  direction: Vector2;
  maxDistance: number;
}

export interface RaycastHit {
  actor: Actor;
  point: Point;
  normal: Vector2;
  distance: number;
}

export interface OverlapPointParams extends PhysicsQueryFilter {
  point: Point;
}

export interface OverlapCircleParams extends PhysicsQueryFilter {
  center: Point;
  radius: number;
}

export interface OverlapBoxParams extends PhysicsQueryFilter {
  center: Point;
  size: Point;
  rotation?: number;
}
