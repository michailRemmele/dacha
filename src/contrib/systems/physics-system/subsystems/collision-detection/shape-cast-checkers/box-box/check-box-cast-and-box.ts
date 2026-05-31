import { intersectionCheckers } from '../../intersection-checkers';
import type { BoxCastGeometry, BoxGeometry } from '../../types';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';
import { checkBoxCastAndConvexPoints, correctContactPoint } from '../box-utils';

export const checkBoxCastAndBox: ShapeCastCheckerFn<
  BoxCastGeometry,
  BoxGeometry
> = (boxCast, box) => {
  const overlapIntersection = intersectionCheckers.box.box(boxCast, box);

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const hit = checkBoxCastAndConvexPoints(boxCast, box.points);

  correctContactPoint(boxCast, hit);

  return hit;
};
