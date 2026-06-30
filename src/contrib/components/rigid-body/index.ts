import { Component } from '../../../engine/component';
import { Vector2, type Point } from '../../../engine/math-lib';

export type RigidBodyType = 'dynamic' | 'static' | 'kinematic';

export interface RigidBodyConfig {
  type: RigidBodyType;
  mass?: number;
  gravityScale?: number;
  linearDamping?: number;
  angularDamping?: number;
  lockRotation?: boolean;
  restitution?: number;
  friction?: number;
  disabled: boolean;
  oneWay: boolean;
  oneWayNormalX?: number;
  oneWayNormalY?: number;
}

interface PointForce {
  force: Vector2;
  position: Point;
}

interface PointImpulse {
  impulse: Vector2;
  position: Point;
}

/**
 * RigidBody component for defining rigid body physics.
 *
 * Defines the physics properties for an actor. Dynamic bodies react to forces,
 * impulses, gravity, collisions, and rotation. Static and kinematic bodies can
 * participate in collisions but are not moved by solver impulses.
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
  private _inertia: number;
  private _inverseInertia: number;
  private _restitution: number;
  private _friction: number;

  /** @internal Pending one-step kinematic movement target */
  _movementTarget: Vector2 | null;
  /** @internal Linear velocity from the start of the current physics step */
  _prevLinearVelocity: Vector2;
  /** @internal Angular velocity from the start of the current physics step */
  _prevAngularVelocity: number;
  /** @internal Temporary solver velocity used for contact separation */
  _biasLinearVelocity: Vector2;
  /** @internal Temporary solver angular velocity used for contact separation */
  _biasAngularVelocity: number;

  /** Body type that defines how the rigid body participates in simulation */
  readonly type: RigidBodyType;
  /** Gravity multiplier. `0` ignores gravity, `1` uses normal world gravity. */
  gravityScale: number;
  /** Linear damping used to slow down movement over time */
  linearDamping: number;
  /** Angular damping used to slow down rotation over time */
  angularDamping: number;
  /** Current linear velocity in world units per second */
  linearVelocity: Vector2;
  /** Current angular velocity of the rigid body in radians per second */
  angularVelocity: number;
  /** Whether dynamic rotation is locked. Locked bodies do not spin from torque or contacts. */
  lockRotation: boolean;
  /** Whether rigid body simulation is disabled */
  disabled: boolean;
  /** Whether rigid body is sleeping */
  sleeping: boolean;

  /** @internal Force applied at the rigid body center */
  _centralForce: Vector2;
  /** @internal Impulse applied at the rigid body center */
  _centralImpulse: Vector2;
  /** @internal Forces applied at world-space positions */
  _pointForces: PointForce[];
  /** @internal Impulses applied at world-space positions */
  _pointImpulses: PointImpulse[];
  /** @internal Torque applied to the rigid body */
  _torque: number;
  /** @internal Angular impulse applied to the rigid body */
  _angularImpulse: number;

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
    this._inertia = 0;
    this._inverseInertia = 0;
    this._restitution = 0;
    this._friction = 0;

    this._movementTarget = null;
    this._prevLinearVelocity = new Vector2(0, 0);
    this._prevAngularVelocity = 0;
    this._biasLinearVelocity = new Vector2(0, 0);
    this._biasAngularVelocity = 0;

    this.type = config.type;
    this.mass = config.mass ?? 0;
    this.gravityScale = config.gravityScale ?? 0;
    this.linearDamping = config.linearDamping ?? 0;
    this.angularDamping = config.angularDamping ?? 0;
    this.restitution = config.restitution ?? 0;
    this.friction = config.friction ?? 0.6;
    this.lockRotation = config.lockRotation ?? false;
    this.disabled = config.disabled;
    this.linearVelocity = new Vector2(0, 0);
    this.angularVelocity = 0;
    this.sleeping = false;

    this._centralForce = new Vector2(0, 0);
    this._centralImpulse = new Vector2(0, 0);
    this._pointForces = [];
    this._pointImpulses = [];
    this._torque = 0;
    this._angularImpulse = 0;

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
    if (this.type === 'static' || this.type === 'kinematic') {
      return 0;
    }

    return this._inverseMass;
  }

  get inertia(): number {
    return this._inertia;
  }

  /**
   * Moment of inertia used by dynamic bodies.
   *
   * Inertia is the rotational equivalent of mass: higher values make the body
   * harder to spin. It is automatically computed from the collider shape, mass,
   * and collider offset every physics step, so user code usually should only
   * read this value.
   */
  set inertia(value: number) {
    this._inertia = value;
    this._inverseInertia = value > 0 ? 1 / value : 0;
  }

  /**
   * Returns the inverse moment of inertia.
   *
   * This is the solver-friendly form of inertia. Static bodies, kinematic
   * bodies, locked rotation, or non-positive inertia return `0`.
   */
  get inverseInertia(): number {
    if (
      this.type === 'static' ||
      this.type === 'kinematic' ||
      this.lockRotation
    ) {
      return 0;
    }

    return this._inverseInertia;
  }

  /** Bounciness used by contact resolution. `0` does not bounce, `1` keeps full bounce speed. */
  get restitution(): number {
    return this._restitution;
  }

  set restitution(value: number) {
    this._restitution = Math.max(0, Math.min(value, 1));
  }

  /** Surface friction used by contact resolution. Higher values reduce sliding more strongly. */
  get friction(): number {
    return this._friction;
  }

  set friction(value: number) {
    this._friction = Math.max(0, value);
  }

  /**
   * Adds a continuous force to a dynamic body for the next physics step.
   *
   * Affects only active dynamic bodies. When `position` is provided, it is a
   * world-space point where the force is applied; off-center forces can also
   * rotate the body.
   */
  applyForce(force: Vector2, position?: Point): void {
    if (this.disabled || this.type !== 'dynamic') {
      return;
    }

    this.wakeUp();

    if (!position) {
      this._centralForce.add(force);
      return;
    }

    this._pointForces.push({
      force: force.clone(),
      position: { x: position.x, y: position.y },
    });
  }

  /**
   * Adds an instantaneous impulse to a dynamic body for the next physics step.
   *
   * Affects only active dynamic bodies. An impulse is a one-step velocity kick.
   * When `position` is provided, it is a world-space point where the impulse is
   * applied; off-center impulses can also rotate the body.
   */
  applyImpulse(impulse: Vector2, position?: Point): void {
    if (this.disabled || this.type !== 'dynamic') {
      return;
    }

    this.wakeUp();

    if (!position) {
      this._centralImpulse.add(impulse);
      return;
    }

    this._pointImpulses.push({
      impulse: impulse.clone(),
      position: { x: position.x, y: position.y },
    });
  }

  /**
   * Adds a continuous torque to a dynamic body for the next physics step.
   *
   * Torque is rotational force: it changes angular velocity over time. Affects
   * only active dynamic bodies with unlocked rotation.
   */
  applyTorque(torque: number): void {
    if (this.disabled || this.type !== 'dynamic' || this.lockRotation) {
      return;
    }

    this.wakeUp();
    this._torque += torque;
  }

  /**
   * Adds an instantaneous angular impulse to a dynamic body for the next physics step.
   *
   * Angular impulse is an immediate rotational kick. Affects only active dynamic
   * bodies with unlocked rotation.
   */
  applyAngularImpulse(impulse: number): void {
    if (this.disabled || this.type !== 'dynamic' || this.lockRotation) {
      return;
    }

    this.wakeUp();
    this._angularImpulse += impulse;
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
    this._centralForce.multiplyNumber(0);
    this._centralImpulse.multiplyNumber(0);
    this._pointForces.length = 0;
    this._pointImpulses.length = 0;
    this._torque = 0;
    this._angularImpulse = 0;
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
