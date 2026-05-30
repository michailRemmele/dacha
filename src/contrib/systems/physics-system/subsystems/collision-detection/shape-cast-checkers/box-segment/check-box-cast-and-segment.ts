import { intersectionCheckers } from '../../intersection-checkers';
import type { SegmentGeometry } from '../../types';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';
import { checkBoxCastAndConvexPoints, correctContactPoint } from '../box-utils';

export const checkBoxCastAndSegment: ShapeCastCheckerFn = (
  queryProxy,
  targetProxy,
) => {
  const overlapIntersection = intersectionCheckers.box.segment(
    queryProxy,
    targetProxy,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const segment = targetProxy.geometry as SegmentGeometry;

  const hit = checkBoxCastAndConvexPoints(queryProxy, [
    segment.point1,
    segment.point2,
  ]);

  correctContactPoint(queryProxy, hit);

  return hit;
};
