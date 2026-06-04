import { Component } from '../../../engine/component';
import { Vector2 } from '../../../engine/math-lib';
import type { Actor } from '../../../engine/actor';

export interface CharacterControllerConfig {
  disabled?: boolean;
  upDirectionX?: number;
  upDirectionY?: number;
  safeMargin?: number;
  maxSlopeAngle?: number;
  maxSlides?: number;
  groundSnapDistance?: number;
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
export class CharacterController extends Component {
  private _up: Vector2;

  /** @internal Pending one-step displacement consumed by CharacterControllerSystem */
  _displacement: Vector2;

  /** Whether the controller should be ignored by CharacterControllerSystem */
  disabled: boolean;
  /** Desired character velocity in world units per second */
  velocity: Vector2;
  /** Small distance kept between the character shape and blocking colliders */
  safeMargin: number;
  /** Maximum walkable ground angle in radians, measured from upDirection */
  maxSlopeAngle: number;
  /** Maximum sweep/slide collision iterations used during one fixed update */
  maxSlides: number;
  /** Distance used to probe opposite upDirection and keep ground contact over small gaps */
  groundSnapDistance: number;

  /** Whether the controller is standing on walkable ground after the last fixed update */
  onGround: boolean;
  /** Whether movement hit a side wall or non-walkable surface during the last fixed update */
  onWall: boolean;
  /** Whether movement hit a ceiling during the last fixed update */
  onCeiling: boolean;
  /** Normal of the current walkable ground surface, updated by CharacterControllerSystem */
  groundNormal: Vector2;
  /** Actor providing the current walkable ground, or null when not grounded */
  groundActor: Actor | null;

  constructor(config: CharacterControllerConfig = {}) {
    super();

    this._up = new Vector2(0, -1);
    this._displacement = new Vector2(0, 0);

    this.upDirection = new Vector2(
      config.upDirectionX ?? 0,
      config.upDirectionY ?? -1,
    );

    this.disabled = config.disabled ?? false;
    this.velocity = new Vector2(0, 0);
    this.safeMargin = config.safeMargin ?? 0.02;
    this.maxSlopeAngle = config.maxSlopeAngle ?? Math.PI / 4;
    this.maxSlides = config.maxSlides ?? 4;
    this.groundSnapDistance = config.groundSnapDistance ?? 0.1;

    this.onGround = false;
    this.onWall = false;
    this.onCeiling = false;
    this.groundNormal = this.upDirection.clone();
    this.groundActor = null;
  }

  /** Direction treated as up for ground, ceiling, slopes, ground snap, and jumps */
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
   * The displacement is consumed by CharacterControllerSystem on the next fixed
   * update and is already expected to be scaled by delta time.
   */
  move(displacement: Vector2): void {
    this._displacement.add(displacement);
  }
}

CharacterController.componentName = 'CharacterController';
