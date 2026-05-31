import type { Actor } from '../../../engine/actor';
import type { CollisionDetectionSubsystem } from './subsystems';
import type {
  CastHit,
  RaycastParams,
  OverlapParams,
  ShapeCastParams,
} from './types';

/**
 * API that provides methods for performing physics queries such as raycasting and overlap tests.
 *
 * Query results are based on the latest prepared physics state.
 * That state is updated during the physics system fixed update step,
 * so direct transform or collider changes made outside physics update
 * are not guaranteed to be reflected immediately in query results.
 *
 * @category Systems
 */
export class PhysicsAPI {
  private collisionDetectionSubsystem: CollisionDetectionSubsystem;

  constructor(collisionDetectionSubsystem: CollisionDetectionSubsystem) {
    this.collisionDetectionSubsystem = collisionDetectionSubsystem;
  }

  /**
   * Casts a ray and returns the nearest hit, if any.
   *
   * The ray starts at `params.origin`, travels in `params.direction`,
   * and is limited by `params.maxDistance`.
   *
   * @param params - Raycast parameters
   * @returns The nearest hit or `null` when nothing is hit
   */
  raycast(params: RaycastParams): CastHit | null {
    return this.collisionDetectionSubsystem.raycast(params);
  }

  /**
   * Casts a ray and returns all hits sorted by distance.
   *
   * The ray starts at `params.origin`, travels in `params.direction`,
   * and is limited by `params.maxDistance`.
   *
   * @param params - Raycast parameters
   * @returns All hits sorted from nearest to farthest
   */
  raycastAll(params: RaycastParams): CastHit[] {
    return this.collisionDetectionSubsystem.raycastAll(params);
  }

  /**
   * Returns all actors whose colliders overlap the given query shape.
   *
   * @param params - Overlap parameters
   * @returns Actors whose colliders overlap the shape
   */
  overlapShape(params: OverlapParams): Actor[] {
    return this.collisionDetectionSubsystem.overlapShape(params);
  }

  /**
   * Casts a shape and returns the nearest hit, if any.
   *
   * @param params - Shape cast parameters
   * @returns The nearest hit or `null` when nothing is hit
   */
  shapeCast(params: ShapeCastParams): CastHit | null {
    return this.collisionDetectionSubsystem.shapeCast(params);
  }

  /**
   * Casts a shape and returns all hits sorted by distance.
   *
   * @param params - Shape cast parameters
   * @returns All hits sorted from nearest to farthest
   */
  shapeCastAll(params: ShapeCastParams): CastHit[] {
    return this.collisionDetectionSubsystem.shapeCastAll(params);
  }
}
