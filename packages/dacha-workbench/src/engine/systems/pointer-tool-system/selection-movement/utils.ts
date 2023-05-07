const TOLERANCE = 0.01

export const isFloatEqual = (a: number, b: number): boolean => Math.abs(a - b) < TOLERANCE
