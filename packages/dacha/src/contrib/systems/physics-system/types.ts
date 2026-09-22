import type { SceneSystemOptions } from '../../../engine/system';
import type { Actor } from '../../../engine/actor';
import type { Vector, Point } from '../../../engine/math-lib';

/**
 * The options of {@link PhysicsSystem}.
 *
 * @see [Physics options](https://dachajs.org/systems/physics/#options)
 *
 * @category Physics
 */
export interface PhysicsSystemOptions extends SceneSystemOptions {
  /**
   * Horizontal gravity, in world units per second squared.
   *
   * @defaultValue `0`
   */
  gravityX?: number;
  /**
   * Vertical gravity, in world units per second squared.
   *
   * @defaultValue `980`
   */
  gravityY?: number;
  /**
   * How many times per step the solver works on the contacts. More iterations
   * make stacks of bodies more stable.
   *
   * @defaultValue `8`
   */
  solverIterations?: number;
  /**
   * How deep, in world units, bodies can overlap before the solver pushes them
   * apart. A small overlap stops resting bodies from shaking.
   *
   * @defaultValue `0.5`
   */
  maxAllowedPenetration?: number;
  /**
   * The highest speed, in world units per second, at which the solver pushes
   * overlapping bodies apart.
   *
   * @defaultValue `60`
   */
  maxBiasVelocity?: number;
}

/**
 * A collision layer. Colliders pick it by name in `layer`.
 *
 * @category Physics
 */
export interface CollisionLayer {
  /** A unique id. The collision matrix refers to the layer by it. */
  id: string;
  /** The name colliders use in `layer`. */
  name: string;
}

/**
 * Which layers collide with each other. Both keys are layer ids. `true` means
 * the two layers collide.
 *
 * @category Physics
 */
export type CollisionMatrix = Record<string, Record<string, boolean>>;

/**
 * The global option `physics`.
 *
 * @see [Collision layers](https://dachajs.org/systems/physics/collisions/#collision-layers)
 *
 * @category Physics
 */
export interface PhysicsSettings {
  /** The collision layers. */
  collisionLayers: CollisionLayer[];
  /** Which layers collide with each other. */
  collisionMatrix: CollisionMatrix;
}

/**
 * Filters shared by every physics query. `T` is the hit type of the query.
 *
 * @see [Filters](https://dachajs.org/systems/physics/queries/#filters)
 *
 * @category Physics
 */
export interface PhysicsQueryFilter<T> {
  /**
   * Finds only colliders whose layer collides with this layer, as the collision
   * matrix says.
   */
  layer?: string;
  /** Leaves these actors out. */
  excludeActors?: Actor[];
  /** Gets each actor and returns `false` to leave it out. */
  actorFilter?: (actor: Actor) => boolean;
  /**
   * Gets each hit and returns `false` to leave it out.
   *
   * The query may reuse the `hit` object, so it is valid only during the call.
   * Do not keep a reference to it.
   */
  hitFilter?: (hit: T) => boolean;
}

/**
 * Fields shared by raycasts, shape casts and actor casts.
 *
 * @category Physics
 */
export interface CommonCastParams extends PhysicsQueryFilter<CastHit> {
  /** The direction of the cast. */
  direction: Vector;
  /** How far the cast goes, in world units. */
  maxDistance: number;
}

/**
 * The parameters of {@link PhysicsAPI.raycast} and the other raycast methods.
 *
 * @see [Raycasts](https://dachajs.org/systems/physics/queries/#raycasts)
 *
 * @category Physics
 */
export interface RaycastParams extends CommonCastParams {
  /** The start of the ray, in world space. */
  origin: Point;
}

/**
 * A hit of a raycast, a shape cast or an actor cast.
 *
 * @category Physics
 */
export interface CastHit {
  /** The actor that was hit. */
  actor: Actor;
  /** The point where the ray or the shape touches the collider, in world space. */
  point: Point;
  /**
   * The direction out of the surface that was hit. It points back toward the
   * ray or the shape.
   */
  normal: Vector;
  /** How far the ray or the shape went before it touched the collider. */
  distance: number;
}

/**
 * A hit of an overlap query.
 *
 * @category Physics
 */
export interface OverlapHit {
  /** The actor that overlaps the shape. */
  actor: Actor;
  /** The direction from the actor to the query shape. */
  normal: Vector;
  /** How deep they overlap along `normal`, in world units. */
  penetration: number;
  /** The points where they touch, in world space. */
  contactPoints: Point[];
}

/**
 * Gets each hit of a cast. The query may reuse the `hit` object, so it is
 * valid only during the call.
 *
 * @category Physics
 */
export type CastHitCallback = (hit: CastHit) => void;

/**
 * Gets each hit of an overlap query. The query may reuse the `hit` object, so
 * it is valid only during the call.
 *
 * @category Physics
 */
export type OverlapHitCallback = (hit: OverlapHit) => void;

/**
 * A point for an overlap query.
 *
 * @category Physics
 */
export interface PointQueryShape {
  type: 'point';
  /** The point, in world space. */
  point: Point;
}

/**
 * A circle for a shape cast or an overlap query.
 *
 * @category Physics
 */
export interface CircleQueryShape {
  type: 'circle';
  /** The center, in world space. */
  center: Point;
  /** The radius. */
  radius: number;
}

/**
 * A capsule for a shape cast or an overlap query.
 *
 * @category Physics
 */
export interface CapsuleQueryShape {
  type: 'capsule';
  /** The center, in world space. */
  center: Point;
  /** The distance between the centers of the two round ends. */
  height: number;
  /** The radius of the round ends. */
  radius: number;
  /** The rotation, in radians. */
  rotation?: number;
}

/**
 * A box for a shape cast or an overlap query.
 *
 * @category Physics
 */
export interface BoxQueryShape {
  type: 'box';
  /** The center, in world space. */
  center: Point;
  /** The width and the height. */
  size: Point;
  /** The rotation, in radians. */
  rotation?: number;
}

/**
 * The parameters of an overlap query with a point.
 *
 * @category Physics
 */
export interface OverlapPointParams extends PhysicsQueryFilter<OverlapHit> {
  /** The point to test. */
  shape: PointQueryShape;
}

/**
 * The parameters of an overlap query with a circle.
 *
 * @category Physics
 */
export interface OverlapCircleParams extends PhysicsQueryFilter<OverlapHit> {
  /** The circle to test. */
  shape: CircleQueryShape;
}

/**
 * The parameters of an overlap query with a box.
 *
 * @category Physics
 */
export interface OverlapBoxParams extends PhysicsQueryFilter<OverlapHit> {
  /** The box to test. */
  shape: BoxQueryShape;
}

/**
 * The parameters of an overlap query with a capsule.
 *
 * @category Physics
 */
export interface OverlapCapsuleParams extends PhysicsQueryFilter<OverlapHit> {
  /** The capsule to test. */
  shape: CapsuleQueryShape;
}

/**
 * The parameters of {@link PhysicsAPI.overlapShape} and
 * {@link PhysicsAPI.overlapEach}. The `shape.type` field decides which variant
 * it is.
 *
 * @see [Overlaps](https://dachajs.org/systems/physics/queries/#overlaps)
 *
 * @category Physics
 */
export type OverlapParams =
  | OverlapPointParams
  | OverlapCircleParams
  | OverlapBoxParams
  | OverlapCapsuleParams;

/**
 * The parameters of {@link PhysicsAPI.overlapActor} and
 * {@link PhysicsAPI.overlapActorEach}.
 *
 * @category Physics
 */
export interface OverlapActorParams extends PhysicsQueryFilter<OverlapHit> {
  /** The actor whose collider is tested. */
  actor: Actor;
  /** Moves the collider before the test, in world units. */
  offset?: Point;
  /**
   * Finds only colliders whose layer collides with this layer. Without it, the
   * query uses the layer of the actor's collider.
   */
  layer?: string;
  /**
   * Leaves the actor itself out of the results.
   *
   * @defaultValue `true`
   */
  excludeSelf?: boolean;
}

/**
 * The parameters of a shape cast with a circle.
 *
 * @category Physics
 */
export interface CircleCastParams extends CommonCastParams {
  /** The circle at the start of the cast. */
  shape: CircleQueryShape;
}

/**
 * The parameters of a shape cast with a capsule.
 *
 * @category Physics
 */
export interface CapsuleCastParams extends CommonCastParams {
  /** The capsule at the start of the cast. */
  shape: CapsuleQueryShape;
}

/**
 * The parameters of a shape cast with a box.
 *
 * @category Physics
 */
export interface BoxCastParams extends CommonCastParams {
  /** The box at the start of the cast. */
  shape: BoxQueryShape;
}

/**
 * The parameters of {@link PhysicsAPI.shapeCast} and the other shape cast
 * methods. A shape that already overlaps a collider at the start hits it at
 * distance `0`.
 *
 * @see [Shape casts](https://dachajs.org/systems/physics/queries/#shape-casts)
 *
 * @category Physics
 */
export interface ShapeCastParams extends CommonCastParams {
  /** The shape at the start of the cast. */
  shape: CircleQueryShape | CapsuleQueryShape | BoxQueryShape;
}

/**
 * The parameters of {@link PhysicsAPI.castActor} and the other actor cast
 * methods.
 *
 * An actor without a collider finds nothing. An actor with a `segment` collider
 * finds nothing too.
 *
 * @see [Actor casts](https://dachajs.org/systems/physics/queries/#actor-casts)
 *
 * @category Physics
 */
export interface CastActorParams extends CommonCastParams {
  /** The actor whose collider moves. The cast starts from its current `Transform`. */
  actor: Actor;
  /** Moves the start of the cast, in world units. */
  offset?: Point;
  /**
   * Finds only colliders whose layer collides with this layer. Without it, the
   * cast uses the layer of the actor's collider.
   */
  layer?: string;
  /**
   * Leaves the actor itself out of the results.
   *
   * @defaultValue `true`
   */
  excludeSelf?: boolean;
}
