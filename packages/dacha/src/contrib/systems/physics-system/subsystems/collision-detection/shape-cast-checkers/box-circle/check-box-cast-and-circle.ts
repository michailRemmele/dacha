import { intersectionCheckers } from '../../intersection-checkers';
import type { BoxCastGeometry, CircleGeometry } from '../../types';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';
import {
  checkBoxCastAndCircleGeometry,
  correctContactPoint,
} from '../box-utils';

/**
 * Casts a moving box against a circle by treating the target as the union of
 * two expanded axis-aligned rectangles and four corner circles. The nearest
 * sub-hit is then shifted back from the center ray to the moving box support
 * point.
 */
export const checkBoxCastAndCircle: ShapeCastCheckerFn<
  BoxCastGeometry,
  CircleGeometry
> = (boxCast, circle) => {
  const overlapIntersection = intersectionCheckers.box.circle(boxCast, circle);

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const hit = checkBoxCastAndCircleGeometry(
    boxCast,
    circle.center,
    circle.radius,
  );

  correctContactPoint(boxCast, hit);

  return hit;
};
