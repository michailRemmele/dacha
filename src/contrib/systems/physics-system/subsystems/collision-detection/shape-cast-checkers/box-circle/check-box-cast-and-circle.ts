import { intersectionCheckers } from '../../intersection-checkers';
import type { BoxCastGeometry, CircleGeometry } from '../../types';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';
import {
  checkBoxCastAndCircleGeometry,
  correctContactPoint,
} from '../box-utils';

export const checkBoxCastAndCircle: ShapeCastCheckerFn = (
  query,
  target,
) => {
  const box = query as BoxCastGeometry;
  const circle = target as CircleGeometry;
  const overlapIntersection = intersectionCheckers.box.circle(box, circle);

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const hit = checkBoxCastAndCircleGeometry(box, circle.center, circle.radius);

  correctContactPoint(box, hit);

  return hit;
};
