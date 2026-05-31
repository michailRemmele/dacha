import type { Intersection, Point } from '../types';
import { isZero } from '../utils';

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

export const normalizeValue = (value: number): number => {
  return isZero(value) ? 0 : value;
};
