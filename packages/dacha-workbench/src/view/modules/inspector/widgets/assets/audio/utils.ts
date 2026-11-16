export const PRECISE_TIME_LIMIT = 10;

/**
 * Formats seconds as `m:ss`, or as `m:ss.t`.
 */
export const formatTime = (seconds: number, withTenths = false): string => {
  const safe = Number.isFinite(seconds) ? Math.max(seconds, 0) : 0;
  const tenths = Math.floor(safe * 10);
  const total = Math.floor(tenths / 10);
  const minutes = Math.floor(total / 60);
  const rest = String(total % 60).padStart(2, '0');
  return withTenths
    ? `${minutes}:${rest}.${tenths % 10}`
    : `${minutes}:${rest}`;
};
