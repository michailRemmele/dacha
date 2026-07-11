import type { Vector2 } from '../../../engine/math-lib';
import type {
  CastHit,
  OverlapHit,
  RaycastParams,
  OverlapParams,
  OverlapActorParams,
  ShapeCastParams,
  CastActorParams,
  CastHitCallback,
  OverlapHitCallback,
} from './types';

export interface PhysicsAPIHandlers {
  raycast(params: RaycastParams): CastHit | null;
  raycastAll(params: RaycastParams): CastHit[];
  overlapShape(params: OverlapParams): OverlapHit[];
  overlapActor(params: OverlapActorParams): OverlapHit[];
  shapeCast(params: ShapeCastParams): CastHit | null;
  shapeCastAll(params: ShapeCastParams): CastHit[];
  castActor(params: CastActorParams): CastHit | null;
  castActorAll(params: CastActorParams): CastHit[];
  raycastEach(params: RaycastParams, callback: CastHitCallback): void;
  shapeCastEach(params: ShapeCastParams, callback: CastHitCallback): void;
  overlapEach(params: OverlapParams, callback: OverlapHitCallback): void;
  castActorEach(params: CastActorParams, callback: CastHitCallback): void;
  overlapActorEach(
    params: OverlapActorParams,
    callback: OverlapHitCallback,
  ): void;
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
   * Casts a ray and invokes `callback` for every hit.
   *
   * @param params - Raycast parameters
   * @param callback - Invoked once per hit with a reused hit object
   */
  raycastEach(params: RaycastParams, callback: CastHitCallback): void {
    this.handlers.raycastEach(params, callback);
  }

  /**
   * Returns all collider intersections for the given query shape.
   *
   * @param params - Overlap parameters
   * @returns All overlap hits
   */
  overlapShape(params: OverlapParams): OverlapHit[] {
    return this.handlers.overlapShape(params);
  }

  /**
   * Invokes `callback` for every collider intersecting the query shape.
   *
   * @param params - Overlap parameters
   * @param callback - Invoked once per overlap with a reused hit object
   */
  overlapEach(params: OverlapParams, callback: OverlapHitCallback): void {
    this.handlers.overlapEach(params, callback);
  }

  /**
   * Returns all collider intersections for an actor's collider.
   *
   * @param params - Actor overlap parameters
   * @returns All overlap hits
   */
  overlapActor(params: OverlapActorParams): OverlapHit[] {
    return this.handlers.overlapActor(params);
  }

  /**
   * Invokes `callback` for every collider intersecting an actor's collider.
   *
   * @param params - Actor overlap parameters
   * @param callback - Invoked once per overlap with a reused hit object
   */
  overlapActorEach(
    params: OverlapActorParams,
    callback: OverlapHitCallback,
  ): void {
    this.handlers.overlapActorEach(params, callback);
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
   * Casts a shape and invokes `callback` for every hit.
   *
   * @param params - Shape cast parameters
   * @param callback - Invoked once per hit with a reused hit object
   */
  shapeCastEach(params: ShapeCastParams, callback: CastHitCallback): void {
    this.handlers.shapeCastEach(params, callback);
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

  /**
   * Casts an actor's collider and invokes `callback` for every hit.
   *
   * The `hit` passed to `callback` is a single object reused across
   * invocations and is only valid for the duration of the call. Copy any
   * fields you need to keep. Hits are delivered in arbitrary order.
   *
   * @param params - Actor cast parameters
   * @param callback - Invoked once per hit with a reused hit object
   */
  castActorEach(params: CastActorParams, callback: CastHitCallback): void {
    this.handlers.castActorEach(params, callback);
  }
}
