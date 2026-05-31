import { intersectionCheckers } from '../../intersection-checkers';
import type { BoxCastGeometry, SegmentGeometry } from '../../types';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';
import { checkBoxCastAndConvexPoints, correctContactPoint } from '../box-utils';

export const checkBoxCastAndSegment: ShapeCastCheckerFn<
  BoxCastGeometry,
  SegmentGeometry
> = (boxCast, segment) => {
  const overlapIntersection = intersectionCheckers.box.segment(
    boxCast,
    segment,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const hit = checkBoxCastAndConvexPoints(boxCast, [
    segment.point1,
    segment.point2,
  ]);

  correctContactPoint(boxCast, hit);

  return hit;
};
