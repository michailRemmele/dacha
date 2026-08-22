/**
 * Generates a RFC 4122 version 4 UUID.
 *
 * Relies on `crypto.randomUUID`, which is available in the renderer because
 * Electron serves it over localhost — a secure context.
 */
export const uuid = (): string => crypto.randomUUID();
