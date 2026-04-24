import type { Actor } from '../../../engine/actor';
import type { CollisionDetectionSubsystem } from './subsystems';
import type {
  RaycastHit,
  RaycastParams,
  OverlapBoxParams,
  OverlapCircleParams,
  OverlapPointParams,
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
  raycast(params: RaycastParams): RaycastHit | null {
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
  raycastAll(params: RaycastParams): RaycastHit[] {
    return this.collisionDetectionSubsystem.raycastAll(params);
  }

  /**
   * Returns all actors whose colliders contain the given point.
   *
   * @param params - Point overlap parameters
   * @returns Actors whose colliders overlap the point
   */
  overlapPoint(params: OverlapPointParams): Actor[] {
    return this.collisionDetectionSubsystem.overlapPoint(params);
  }

  /**
   * Returns all actors whose colliders overlap the given circle.
   *
   * @param params - Circle overlap parameters
   * @returns Actors whose colliders overlap the circle
   */
  overlapCircle(params: OverlapCircleParams): Actor[] {
    return this.collisionDetectionSubsystem.overlapCircle(params);
  }

  /**
   * Returns all actors whose colliders overlap the given box.
   *
   * @param params - Box overlap parameters
   * @returns Actors whose colliders overlap the box
   */
  overlapBox(params: OverlapBoxParams): Actor[] {
    return this.collisionDetectionSubsystem.overlapBox(params);
  }
}
