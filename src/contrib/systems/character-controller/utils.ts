import { VectorOps, type Point } from '../../../engine/math-lib';

export const clipAgainstNormal = (vector: Point, normal: Point): void => {
  const dot = VectorOps.dotProduct(vector, normal);

  if (dot >= 0) {
    return;
  }

  vector.x -= normal.x * dot;
  vector.y -= normal.y * dot;
};
