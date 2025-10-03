import { Component } from '../../../engine/component';

export type RigidBodyType = 'dynamic' | 'static';

export interface RigidBodyConfig {
  type: RigidBodyType;
  mass: number;
  useGravity: boolean;
  drag: number;
  isPermeable: boolean;
  ghost: boolean;
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
 *   useGravity: true,
 *   isPermeable: false,
 *   ghost: false,
 *   drag: 1,
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
  /** Whether the rigid body is affected by gravity */
  useGravity: boolean;
  /** Whether the dynamic rigid body can pass through another dynamic body */
  isPermeable: boolean;
  /** Whether the rigid body can pass through any other rigid bodies */
  ghost: boolean;
  /** Drag of the rigid body, meaning it will slow down over time */
  drag: number;

  /**
   * Creates a new RigidBody component.
   * @param config - Configuration for the rigid body
   */
  constructor(config: RigidBodyConfig) {
    super();

    this.type = config.type;
    this.mass = config.mass;
    this.useGravity = config.useGravity;
    this.isPermeable = config.isPermeable;
    this.ghost = config.ghost;
    this.drag = config.drag;
  }

  clone(): RigidBody {
    return new RigidBody({
      mass: this.mass,
      useGravity: this.useGravity,
      isPermeable: this.isPermeable,
      ghost: this.ghost,
      type: this.type,
      drag: this.drag,
    });
  }
}

RigidBody.componentName = 'RigidBody';
