import { Component } from '../../../engine/component';
import { Vector2 } from '../../../engine/math-lib';

export type RigidBodyType = 'dynamic' | 'static';

export interface RigidBodyConfig {
  type: RigidBodyType;
  mass: number;
  gravityScale: number;
  linearDamping: number;
  disabled: boolean;
  sleeping?: boolean;
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
  /** Type of the rigid body */
  type: RigidBodyType;
  /** Mass of the rigid body */
  mass: number;
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

  force: Vector2;
  impulse: Vector2;

  /**
   * Creates a new RigidBody component.
   * @param config - Configuration for the rigid body
   */
  constructor(config: RigidBodyConfig) {
    super();

    this.type = config.type;
    this.mass = config.mass;
    this.gravityScale = config.gravityScale;
    this.linearDamping = config.linearDamping;
    this.linearVelocity = new Vector2(0, 0);
    this.disabled = config.disabled;
    this.sleeping = false;

    this.force = new Vector2(0, 0);
    this.impulse = new Vector2(0, 0);
  }

  applyForce(force: Vector2): void {
    if (this.disabled || this.type === 'static') {
      return;
    }

    this.wakeUp();
    this.force.add(force);
  }

  applyImpulse(impulse: Vector2): void {
    if (this.disabled || this.type === 'static') {
      return;
    }

    this.wakeUp();
    this.impulse.add(impulse);
  }

  wakeUp(): void {
    this.sleeping = false;
  }

  sleep(): void {
    this.sleeping = true;
  }

  clearForces(): void {
    this.force.multiplyNumber(0);
    this.impulse.multiplyNumber(0);
  }

  clone(): RigidBody {
    return new RigidBody({
      mass: this.mass,
      gravityScale: this.gravityScale,
      linearDamping: this.linearDamping,
      disabled: this.disabled,
      sleeping: this.sleeping,
      type: this.type,
    });
  }
}

RigidBody.componentName = 'RigidBody';
