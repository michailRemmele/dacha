import { intersectionCheckers } from '../../intersection-checkers';
import type { BoxCastGeometry, BoxGeometry } from '../../types';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';
import { checkBoxCastAndConvexPoints, correctContactPoint } from '../box-utils';

/**
 * Casts a moving box by expanding every target box corner by the moving box
 * half-extents, building the convex hull, and raycasting the moving box center
 * against that expanded target. The final contact point is shifted back from
 * the center ray to the moving box support point.
 */
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
