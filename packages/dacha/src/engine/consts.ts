/**
 * How many times per second `fixedUpdate` runs by default.
 *
 * @see [Game loop](https://dachajs.org/concepts/game-loop/)
 *
 * @category Engine
 */
export const DEFAULT_FIXED_UPDATE_RATE = 50;
/**
 * The default frame rate limit. `Infinity` means no limit.
 *
 * @category Engine
 */
export const DEFAULT_MAX_FPS = Infinity;
/**
 * The longest frame time, in milliseconds, the game loop accepts by default.
 * A longer frame, for example after the browser tab was hidden, counts as this long.
 *
 * @category Engine
 */
export const DEFAULT_MAX_FRAME_DELTA = 250;
/**
 * The default limit of `fixedUpdate` calls in one frame.
 *
 * @category Engine
 */
export const DEFAULT_MAX_FIXED_UPDATES_PER_FRAME = 5;
