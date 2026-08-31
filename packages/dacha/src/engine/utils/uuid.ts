/**
 * Generates a RFC 4122 version 4 UUID.
 *
 * Relies on `crypto.randomUUID`, which browsers expose only in a secure
 * context — https or localhost.
 */
export const uuid = (): string => crypto.randomUUID();
