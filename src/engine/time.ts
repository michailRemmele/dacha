/**
 * @module Time
 * @category Core
 */

/**
 * Shared timing state for the game.
 *
 * All durations are expressed in seconds.
 *
 * @category Core
 */
export class Time {
  private _deltaTime: number;
  private _fixedDeltaTime: number;
  private _elapsedTime: number;
  private _alpha: number;

  constructor() {
    this._deltaTime = 0;
    this._fixedDeltaTime = 0;
    this._elapsedTime = 0;
    this._alpha = 0;
  }

  /**
   * Time elapsed since the last variable update in seconds.
   *
   * Use this for logic in `update`. In `fixedUpdate`, use
   * {@link Time.fixedDeltaTime} instead.
   */
  get deltaTime(): number {
    return this._deltaTime;
  }

  /**
   * The constant fixed-update timestep in seconds.
   *
   * Set once from the configured fixed update rate. Use this for logic in
   * `fixedUpdate`.
   */
  get fixedDeltaTime(): number {
    return this._fixedDeltaTime;
  }

  set fixedDeltaTime(value: number) {
    this._fixedDeltaTime = value;
  }

  /**
   * Total time in seconds since the game started.
   */
  get elapsedTime(): number {
    return this._elapsedTime;
  }

  /**
   * Interpolation factor in `[0, 1)` between the last two fixed steps, for
   * smoothing rendered state. Only meaningful during `update`.
   */
  get alpha(): number {
    return this._alpha;
  }

  /**
   * Advances the per-frame timing state.
   *
   * @internal Called only by the game loop.
   */
  _tick(deltaTime: number, alpha: number): void {
    this._deltaTime = deltaTime;
    this._elapsedTime += deltaTime;
    this._alpha = alpha;
  }

  /**
   * Resets accumulated timing state.
   *
   * @internal Called only by the game loop.
   */
  _reset(): void {
    this._deltaTime = 0;
    this._elapsedTime = 0;
    this._alpha = 0;
  }
}
