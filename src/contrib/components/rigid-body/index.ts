import { Component } from '../../../engine/component';
import { Vector2 } from '../../../engine/math-lib';

export type RigidBodyType = 'dynamic' | 'static' | 'kinematic';

export interface RigidBodyConfig {
  type: RigidBodyType;
  mass: number;
  gravityScale: number;
  linearDamping: number;
  disabled: boolean;
  oneWay: boolean;
  oneWayNormalX?: number;
  oneWayNormalY?: number;
}

/**
 * RigidBody component for defining rigid body physics.
 *
 * Defines the physics properties for an actor. It's used by the
 * physics system to apply forces and impulses to the actor.
 *
 * @example
 * ```typescript
 * // Create a dynamic rigid body
 * const rigidBody = new RigidBody({
 *   type: 'dynamic',
 *   mass: 10,
 *   gravityScale: 1,
 *   linearDamping: 1,
 *   disabled: false,
 * });
 *
 * // Add to actor
 * actor.setComponent(rigidBody);
 *
 * // Modify properties
 * rigidBody.mass = 20;
 * ```
 *
 * @category Components
 */
export class RigidBody extends Component {
  private _mass: number;
  private _inverseMass: number;

  /** @internal Pending one-step kinematic movement target */
  _movementTarget: Vector2 | null;

  /** Body type that defines how the rigid body participates in simulation */
  readonly type: RigidBodyType;
  /** Gravity scale of the rigid body */
  gravityScale: number;
  /** Linear damping value used to slow down movement over time */
  linearDamping: number;
  /** Current linear velocity of the rigid body */
  linearVelocity: Vector2;
  /** Whether rigid body simulation is disabled */
  disabled: boolean;
  /** Whether rigid body is sleeping */
  sleeping: boolean;

  /** Force applied to the rigid body */
  force: Vector2;
  /** Impulse applied to the rigid body */
  impulse: Vector2;

  /** Whether contacts should only be resolved from one side */
  oneWay: boolean;
  /** Local-space normal that points toward the blocking side */
  oneWayNormal?: Vector2;

  /**
   * Creates a new RigidBody component.
   * @param config - Configuration for the rigid body
   */
  constructor(config: RigidBodyConfig) {
    super();

    this._mass = 0;
    this._inverseMass = 0;

    this._movementTarget = null;

    this.type = config.type;
    this.mass = config.mass;
    this.gravityScale = config.gravityScale;
    this.linearDamping = config.linearDamping;
    this.linearVelocity = new Vector2(0, 0);
    this.disabled = config.disabled;
    this.sleeping = false;

    this.force = new Vector2(0, 0);
    this.impulse = new Vector2(0, 0);

    this.oneWay = config.oneWay ?? false;

    if (this.oneWay) {
      this.oneWayNormal = new Vector2(
        config.oneWayNormalX ?? 0,
        config.oneWayNormalY ?? 0,
      ).normalize();

      if (this.oneWayNormal.magnitude === 0) {
        throw new Error('One-way rigid body normal must be non-zero');
      }
    }
  }

  get mass(): number {
    return this._mass;
  }

  /**
   * Sets the mass used by dynamic bodies.
   *
   * Non-positive values make the body immovable by forces and impulses.
   */
  set mass(value: number) {
    this._mass = value;
    this._inverseMass = value > 0 ? 1 / value : 0;
  }

  /**
   * Returns the inverse mass.
   *
   * Bodies with zero or negative mass return `0`.
   */
  get inverseMass(): number {
    return this._inverseMass;
  }

  /**
   * Adds a continuous force to a dynamic body for the next physics step.
   *
   * Affects only active dynamic bodies.
   */
  applyForce(force: Vector2): void {
    if (this.disabled || this.type !== 'dynamic') {
      return;
    }

    this.wakeUp();
    this.force.add(force);
  }

  /**
   * Adds an instantaneous impulse to a dynamic body for the next physics step.
   *
   * Affects only active dynamic bodies.
   */
  applyImpulse(impulse: Vector2): void {
    if (this.disabled || this.type !== 'dynamic') {
      return;
    }

    this.wakeUp();
    this.impulse.add(impulse);
  }

  /**
   * Marks the rigid body as awake so it can be simulated.
   */
  wakeUp(): void {
    this.sleeping = false;
  }

  /**
   * Marks the rigid body as sleeping so dynamic integration can skip it.
   */
  sleep(): void {
    this.sleeping = true;
  }

  /**
   * Clears all accumulated force and impulse values.
   */
  clearForces(): void {
    this.force.multiplyNumber(0);
    this.impulse.multiplyNumber(0);
  }

  /**
   * Moves a kinematic body to a target position on the next physics step.
   *
   * The physics system computes a one-step velocity from the current position
   * to this target so contacts can react to the kinematic movement.
   */
  movePosition(position: Vector2): void {
    if (this.disabled || this.type !== 'kinematic') {
      return;
    }

    this._movementTarget = position.clone();
  }
}

RigidBody.componentName = 'RigidBody';
