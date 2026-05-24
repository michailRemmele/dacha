import type { Intersection, Point } from '../types';
import type { ShapeCastCheckerHit } from './types';

export const buildInitialOverlapHit = (
  intersection: Intersection,
  point?: Point,
): ShapeCastCheckerHit => {
  return {
    normal: intersection.normal.multiplyNumber(-1),
    distance: 0,
    point: point ?? intersection.contactPoints[0],
  };
};
