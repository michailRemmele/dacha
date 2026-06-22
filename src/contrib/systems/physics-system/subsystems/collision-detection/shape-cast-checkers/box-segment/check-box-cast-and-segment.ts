import { intersectionCheckers } from '../../intersection-checkers';
import type { BoxCastGeometry, SegmentGeometry } from '../../types';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';
import {
  checkBoxCastAndConvexPointPair,
  correctContactPoint,
} from '../box-utils';

/**
 * Casts a moving box against a segment by expanding both segment endpoints by
 * the moving box half-extents, building the convex hull, and raycasting the box
 * center against that expanded segment shape.
 */
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

  const hit = checkBoxCastAndConvexPointPair(
    boxCast,
    segment.point1,
    segment.point2,
  );

  correctContactPoint(boxCast, hit);

  return hit;
};
