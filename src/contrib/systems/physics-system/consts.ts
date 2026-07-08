export const LINEAR_SLEEP_THRESHOLD = 2;
export const ANGULAR_SLEEP_THRESHOLD = 0.05;
export const BIAS_LINEAR_SLEEP_THRESHOLD = 2;
export const BIAS_ANGULAR_SLEEP_THRESHOLD = 0.1;
export const SLEEP_TIME_THRESHOLD = 0.5;

export const SOLVER_ITERATIONS = 8;
export const CONTACT_BIAS = 0.2;
export const CONTACT_MAX_ALLOWED_PENETRATION = 0.5;
export const MAX_BIAS_VELOCITY = 60;
export const RESTITUTION_VELOCITY_THRESHOLD = 1;
export const CONTACT_SPEED_SLEEP_THRESHOLD = 2;
// Kept above CONTACT_MAX_ALLOWED_PENETRATION so a settled stack resting at the
// allowed slop does not wake itself from its own steady-state penetration.
export const CONTACT_PENETRATION_SLEEP_THRESHOLD = 0.75;
// dot(normal, gravity)/|gravity| a contact must reach to count as "support":
// 0.5 treats surfaces up to ~60° from horizontal as holding a body up.
export const SUPPORT_MIN_GRAVITY_DOT = 0.5;
