import { Component } from '../../../engine/component';

/**
 * How {@link Interpolation} smooths the movement.
 *
 * - `interpolate` blends between the last two fixed steps. It adds up to one
 *   fixed step of visual delay.
 * - `extrapolate` moves the actor forward from the latest step by the velocity
 *   of its {@link RigidBody}. It adds no delay, but can overshoot on impact.
 *
 * @category Interpolation
 */
export type InterpolationMode = 'interpolate' | 'extrapolate';

/**
 * Options for {@link Interpolation}.
 *
 * @category Interpolation
 */
export interface InterpolationConfig {
  mode?: InterpolationMode;
  snapThreshold?: number;
  disabled?: boolean;
}

/**
 * Smooths the drawn movement of an actor that moves in `fixedUpdate`.
 *
 * The transform keeps the real position. The renderer draws the smoothed one.
 *
 * @see [Interpolation](https://dachajs.org/systems/interpolation/)
 *
 * @category Interpolation
 */
export class Interpolation extends Component {
  /**
   * How render values are produced. `interpolate` blends between the last
   * two fixed steps (smooth, adds up to one fixed step of visual latency).
   * `extrapolate` projects the latest step forward using the rigid body
   * velocity (no added latency, may briefly overshoot on impacts).
   *
   * `extrapolate` uses the world-space rigid body velocity against
   * local-space snapshots, so it is intended for root-level actors.
   */
  mode: InterpolationMode;

  /**
   * Maximum distance in world units treated as continuous movement between
   * two fixed steps. Larger jumps snap instead of gliding. `0` disables
   * the automatic snap detection.
   */
  snapThreshold: number;

  /** Whether smoothing is turned off. The renderer falls back to Transform. */
  disabled: boolean;

  /** @internal Local-space position X from the previous fixed step */
  _prevX: number;
  /** @internal Local-space position Y from the previous fixed step */
  _prevY: number;
  /** @internal Local-space rotation from the previous fixed step */
  _prevRotation: number;
  /** @internal Local-space position X from the latest fixed step */
  _currX: number;
  /** @internal Local-space position Y from the latest fixed step */
  _currY: number;
  /** @internal Local-space rotation from the latest fixed step */
  _currRotation: number;
  /** @internal Whether snapshots have been initialized since (re)enabling */
  _initialized: boolean;
  /** @internal Whether smoothing should be skipped at the next opportunity */
  _snapRequested: boolean;

  /**
   * Render-facing local-space position X, written by Interpolator
   *
   * @advanced
   */
  renderX: number;
  /**
   * Render-facing local-space position Y, written by Interpolator
   *
   * @advanced
   */
  renderY: number;
  /**
   * Render-facing local-space rotation, written by Interpolator
   *
   * @advanced
   */
  renderRotation: number;

  constructor(config: InterpolationConfig = {}) {
    super();

    const {
      mode = 'interpolate',
      snapThreshold = 0,
      disabled = false,
    } = config;

    this.mode = mode;
    this.snapThreshold = snapThreshold;
    this.disabled = disabled;

    this._prevX = 0;
    this._prevY = 0;
    this._prevRotation = 0;
    this._currX = 0;
    this._currY = 0;
    this._currRotation = 0;
    this._initialized = false;
    this._snapRequested = false;

    this.renderX = 0;
    this.renderY = 0;
    this.renderRotation = 0;
  }

  /**
   * Whether the render-facing values hold a valid snapshot yet. `false`
   * until the Interpolator takes its first snapshot after the component is
   * (re)enabled.
   *
   * @advanced
   */
  get initialized(): boolean {
    return this._initialized;
  }

  /**
   * Requests an immediate jump to the Transform instead of
   * smoothing towards it. Call right after teleporting the actor.
   */
  snap(): void {
    this._snapRequested = true;
  }
}

Interpolation.componentName = 'Interpolation';
