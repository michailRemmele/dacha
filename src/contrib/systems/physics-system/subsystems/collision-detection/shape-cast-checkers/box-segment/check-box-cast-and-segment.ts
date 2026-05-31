import { intersectionCheckers } from '../../intersection-checkers';
import type { BoxCastGeometry, SegmentGeometry } from '../../types';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';
import { checkBoxCastAndConvexPoints, correctContactPoint } from '../box-utils';

export const checkBoxCastAndSegment: ShapeCastCheckerFn = (
  query,
  target,
) => {
  const box = query as BoxCastGeometry;
  const segment = target as SegmentGeometry;
  const overlapIntersection = intersectionCheckers.box.segment(
    box,
    segment,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const hit = checkBoxCastAndConvexPoints(box, [
    segment.point1,
    segment.point2,
  ]);

  correctContactPoint(box, hit);

  return hit;
};
