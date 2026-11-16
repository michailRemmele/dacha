/**
 * Base URL of the public bucket holding the documentation's video.
 */
export const MEDIA_BASE_URL =
  (process.env.MEDIA_BASE_URL ?? '').replace(/\/+$/, '') || '/media';
