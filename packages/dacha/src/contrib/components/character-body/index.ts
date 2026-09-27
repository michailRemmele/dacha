import { Component } from '../../../engine/component';
import { DefineComponent, DefineField } from '../../../engine/decorators';
import { MathOps, Vector, type Point } from '../../../engine/math-lib';
import type { Actor } from '../../../engine/actor';

/** @inline */
export type CharacterMotionMode = 'surface' | 'free';

/**
 * Options for {@link CharacterBody}.
 *
 * @category Character Controller
 */
export interface CharacterBodyConfig {
  motionMode?: CharacterMotionMode;
  upDirection?: Point;
  skinWidth?: number;
  maxSlopeAngle?: number;
  maxSlides?: number;
  maxRecoveries?: number;
  groundSnapDistance?: number;
  disabled?: boolean;
}

/**
 * Makes an actor a character for {@link CharacterController}.
 *
 * Set `velocity` to move the character. After each fixed step, read `onGround`,
 * `onWall` and `onCeiling`.
 *
 * @see [Character controller](https://dachajs.org/systems/character-controller/)
 *
 * @category Character Controller
 */
@DefineComponent({
  name: 'CharacterBody',
  icon: 'PersonFill',
  sections: {
    motion: { defaultOpen: true },
  },
})
export class CharacterBody extends Component {
  private _up: Vector;

  /** @internal Pending one-step displacement consumed by CharacterController */
  _displacement: Vector;
  /** @internal Whether CharacterController should run overlap recovery */
  _needsRecovery: boolean;

  /** Controls contact classification and whether ground snapping is enabled. */
  @DefineField({
    type: 'select',
    initialValue: 'surface',
    section: 'motion',
    options: ['surface', 'free'],
  })
  motionMode: CharacterMotionMode;

  /** Direction treated as up for ground, ceiling, slopes, ground probes, and jumps */
  @DefineField({
    initialValue: { x: 0, y: -1 },
    section: 'motion',
    dependency: { name: 'motionMode', value: 'surface' },
  })
  get upDirection(): Vector {
    return this._up;
  }

  set upDirection(value: Vector) {
    this._up = value.clone().normalize();

    if (this._up.magnitude === 0) {
      throw new Error('Character controller upDirection must be non-zero');
    }
  }

  /** Maximum walkable ground angle in radians, measured from upDirection */
  @DefineField({
    initialValue: 45,
    section: 'motion',
    dependency: { name: 'motionMode', value: 'surface' },
  })
  maxSlopeAngle: number;
  /** Distance used to probe opposite upDirection and keep ground contact over small gaps */
  @DefineField({
    initialValue: 1,
    section: 'motion',
    dependency: { name: 'motionMode', value: 'surface' },
  })
  groundSnapDistance: number;
  /** Small distance kept between the character shape and blocking colliders */
  @DefineField({ initialValue: 0.1, section: 'collision' })
  skinWidth: number;
  /** Maximum sweep/slide collision iterations used during one fixed update */
  @DefineField({ initialValue: 4, section: 'collision' })
  maxSlides: number;
  /** Maximum overlap depenetration iterations used when recovery is requested */
  @DefineField({ initialValue: 3, section: 'collision' })
  maxRecoveries: number;
  /** Whether the controller should be ignored by CharacterController */
  @DefineField({ initialValue: false })
  disabled: boolean;

  /** Desired character velocity in world units per second */
  velocity: Vector;

  /** Whether the controller is standing on walkable ground after the last fixed update */
  onGround: boolean;
  /** Whether movement hit a side wall or non-walkable surface during the last fixed update */
  onWall: boolean;
  /** Whether movement hit a ceiling during the last fixed update */
  onCeiling: boolean;
  /** Normal of the current walkable ground surface, updated by CharacterController */
  groundNormal: Vector;
  /** Actor providing the current walkable ground, or null when not grounded */
  groundActor: Actor | null;

  constructor(config: CharacterBodyConfig = {}) {
    super();

    this._up = new Vector(0, -1);
    this._displacement = new Vector(0, 0);
    this._needsRecovery = true;

    this.upDirection = new Vector(
      config.upDirection?.x ?? 0,
      config.upDirection?.y ?? -1,
    );

    this.motionMode = config.motionMode ?? 'surface';
    this.disabled = config.disabled ?? false;
    this.velocity = new Vector(0, 0);
    this.skinWidth = config.skinWidth ?? 0.1;
    this.maxSlopeAngle = MathOps.degToRad(config.maxSlopeAngle ?? 45);
    this.maxSlides = config.maxSlides ?? 4;
    this.maxRecoveries = config.maxRecoveries ?? 3;
    this.groundSnapDistance = config.groundSnapDistance ?? 1;

    this.onGround = false;
    this.onWall = false;
    this.onCeiling = false;
    this.groundNormal = this.upDirection.clone();
    this.groundActor = null;
  }

  /**
   * Adds a one-step world-space displacement request.
   *
   * The displacement is consumed by CharacterController on the next fixed
   * update and is already expected to be scaled by delta time.
   */
  move(displacement: Vector): void {
    this._displacement.add(displacement);
  }

  /**
   * Requests overlap depenetration on the next CharacterController update.
   */
  recover(): void {
    this._needsRecovery = true;
  }
}
