const FLOAT_EPSILON = 1e-5;

export const floatEquals = (a: number, b: number): boolean => {
  return Math.abs(a - b) < FLOAT_EPSILON;
};
