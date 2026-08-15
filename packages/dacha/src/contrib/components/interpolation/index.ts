import { Component } from '../../../engine/component';

export type InterpolationMode = 'interpolate' | 'extrapolate';

export interface InterpolationConfig {
  mode?: InterpolationMode;
  snapThreshold?: number;
  disabled?: boolean;
}

/**
 * Component that smooths rendering of actors moved during fixed updates.
 *
 * Interpolator keeps local-space snapshots of the actor's Transform around
 * each fixed step and blends them into the render-facing
 * `renderX`/`renderY`/`renderRotation` values every render frame using
 * `Time.alpha`. The renderer prefers these values over the Transform.
 *
 * The Transform component always holds the authoritative simulation state.
 * Interpolated values are only visible to the renderer and to consumers of
 * InterpolatorAPI, so simulation code can never accidentally read a
 * visually smoothed but physically incorrect position.
 *
 * @example
 * ```typescript
 * actor.setComponent(new Interpolation({ mode: 'interpolate' }));
 *
 * // After teleporting the actor, skip smoothing for the jump:
 * actor.getComponent(Transform).world.position.x = 500;
 * actor.getComponent(Interpolation).snap();
 * ```
 *
 * @category Components
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

  /** Render-facing local-space position X, written by Interpolator */
  renderX: number;
  /** Render-facing local-space position Y, written by Interpolator */
  renderY: number;
  /** Render-facing local-space rotation, written by Interpolator */
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
