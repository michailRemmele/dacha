import type { Actor } from '../../../engine/actor';
import type { Vector2 } from '../../../engine/math-lib';
import type {
  CastHit,
  RaycastParams,
  OverlapParams,
  ShapeCastParams,
  CastActorParams,
} from './types';

export interface PhysicsAPIHandlers {
  raycast(params: RaycastParams): CastHit | null;
  raycastAll(params: RaycastParams): CastHit[];
  overlapShape(params: OverlapParams): Actor[];
  shapeCast(params: ShapeCastParams): CastHit | null;
  shapeCastAll(params: ShapeCastParams): CastHit[];
  castActor(params: CastActorParams): CastHit | null;
  castActorAll(params: CastActorParams): CastHit[];
  getGravity(): Vector2;
  setGravity(gravity: Vector2): void;
}

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
  private handlers: PhysicsAPIHandlers;

  constructor(handlers: PhysicsAPIHandlers) {
    this.handlers = handlers;
  }

  /**
   * Current gravity vector.
   */
  get gravity(): Vector2 {
    return this.handlers.getGravity();
  }

  /**
   * Sets the gravity vector.
   *
   * @param gravity - New gravity vector
   */
  set gravity(gravity: Vector2) {
    this.handlers.setGravity(gravity);
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
    return this.handlers.raycast(params);
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
    return this.handlers.raycastAll(params);
  }

  /**
   * Returns all actors whose colliders overlap the given query shape.
   *
   * @param params - Overlap parameters
   * @returns Actors whose colliders overlap the shape
   */
  overlapShape(params: OverlapParams): Actor[] {
    return this.handlers.overlapShape(params);
  }

  /**
   * Casts a shape and returns the nearest hit, if any.
   *
   * @param params - Shape cast parameters
   * @returns The nearest hit or `null` when nothing is hit
   */
  shapeCast(params: ShapeCastParams): CastHit | null {
    return this.handlers.shapeCast(params);
  }

  /**
   * Casts a shape and returns all hits sorted by distance.
   *
   * @param params - Shape cast parameters
   * @returns All hits sorted from nearest to farthest
   */
  shapeCastAll(params: ShapeCastParams): CastHit[] {
    return this.handlers.shapeCastAll(params);
  }

  /**
   * Casts an actor's collider and returns the nearest hit, if any.
   *
   * @param params - Actor cast parameters
   * @returns The nearest hit or `null` when nothing is hit
   */
  castActor(params: CastActorParams): CastHit | null {
    return this.handlers.castActor(params);
  }

  /**
   * Casts an actor's collider and returns all hits sorted by distance.
   *
   * @param params - Actor cast parameters
   * @returns All hits sorted from nearest to farthest
   */
  castActorAll(params: CastActorParams): CastHit[] {
    return this.handlers.castActorAll(params);
  }
}
