import { Component } from '../../../engine/component';
import { MathOps, Vector2 } from '../../../engine/math-lib';
import type { Actor } from '../../../engine/actor';

export interface CharacterBodyConfig {
  upDirectionX?: number;
  upDirectionY?: number;
  skinWidth?: number;
  maxSlopeAngle?: number;
  maxSlides?: number;
  groundProbeDistance?: number;
  disabled?: boolean;
}

/**
 * Kinematic character controller state and movement settings.
 *
 * The controller system consumes `velocity` during fixed updates, performs
 * sweep/slide collision handling, and writes the resulting target through the
 * actor's kinematic rigid body.
 *
 * @category Components
 */
export class CharacterBody extends Component {
  private _up: Vector2;

  /** @internal Pending one-step displacement consumed by CharacterController */
  _displacement: Vector2;

  /** Desired character velocity in world units per second */
  velocity: Vector2;
  /** Small distance kept between the character shape and blocking colliders */
  skinWidth: number;
  /** Maximum walkable ground angle in radians, measured from upDirection */
  maxSlopeAngle: number;
  /** Maximum sweep/slide collision iterations used during one fixed update */
  maxSlides: number;
  /** Distance used to probe opposite upDirection and keep ground contact over small gaps */
  groundProbeDistance: number;
  /** Whether the controller should be ignored by CharacterController */
  disabled: boolean;

  /** Whether the controller is standing on walkable ground after the last fixed update */
  onGround: boolean;
  /** Whether movement hit a side wall or non-walkable surface during the last fixed update */
  onWall: boolean;
  /** Whether movement hit a ceiling during the last fixed update */
  onCeiling: boolean;
  /** Normal of the current walkable ground surface, updated by CharacterController */
  groundNormal: Vector2;
  /** Actor providing the current walkable ground, or null when not grounded */
  groundActor: Actor | null;

  constructor(config: CharacterBodyConfig = {}) {
    super();

    this._up = new Vector2(0, -1);
    this._displacement = new Vector2(0, 0);

    this.upDirection = new Vector2(
      config.upDirectionX ?? 0,
      config.upDirectionY ?? -1,
    );

    this.disabled = config.disabled ?? false;
    this.velocity = new Vector2(0, 0);
    this.skinWidth = config.skinWidth ?? 0.1;
    this.maxSlopeAngle = MathOps.degToRad(config.maxSlopeAngle ?? 45);
    this.maxSlides = config.maxSlides ?? 4;
    this.groundProbeDistance = config.groundProbeDistance ?? 1;

    this.onGround = false;
    this.onWall = false;
    this.onCeiling = false;
    this.groundNormal = this.upDirection.clone();
    this.groundActor = null;
  }

  /** Direction treated as up for ground, ceiling, slopes, ground probes, and jumps */
  get upDirection(): Vector2 {
    return this._up;
  }

  set upDirection(value: Vector2) {
    this._up = value.clone().normalize();

    if (this._up.magnitude === 0) {
      throw new Error('Character controller upDirection must be non-zero');
    }
  }

  /**
   * Adds a one-step world-space displacement request.
   *
   * The displacement is consumed by CharacterController on the next fixed
   * update and is already expected to be scaled by delta time.
   */
  move(displacement: Vector2): void {
    this._displacement.add(displacement);
  }
}

CharacterBody.componentName = 'CharacterBody';
