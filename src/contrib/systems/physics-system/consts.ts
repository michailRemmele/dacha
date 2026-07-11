export const DEFAULT_SOLVER_ITERATIONS = 8;
export const DEFAULT_LINEAR_SLEEP_THRESHOLD = 1;
export const DEFAULT_ANGULAR_SLEEP_THRESHOLD = 0.05;
export const DEFAULT_SLEEP_TIME_THRESHOLD = 0.5;

export const DEFAULT_MAX_BIAS_VELOCITY = 60;
export const DEFAULT_CONTACT_MAX_ALLOWED_PENETRATION = 0.5;

export const CONTACT_BIAS = 0.2;
export const BIAS_ANGULAR_SLEEP_MULTIPLIER = 2;
export const RESTITUTION_VELOCITY_THRESHOLD = 1;
// Kept above maxAllowedPenetration so a settled stack resting at the
// allowed slop does not wake itself from its own steady-state penetration.
export const PENETRATION_SLEEP_MARGIN = 0.25;
// 0.5 treats surfaces up to ~60° from horizontal as holding a body up.
export const SUPPORT_MIN_GRAVITY_DOT = 0.5;

// Default gravity in world units (px/s²).
export const DEFAULT_GRAVITY_X = 0;
export const DEFAULT_GRAVITY_Y = 980;
