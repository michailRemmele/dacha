import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import { intersectionCheckers } from '../../intersection-checkers';
import type { CapsuleCastGeometry, SegmentGeometry } from '../../types';
import { checkCircleCastAndSegment } from '../circle-segment/check-circle-cast-and-segment';
import type { ShapeCastCheckerFn, ShapeCastCheckerHit } from '../types';
import { buildInitialOverlapHit } from '../utils';
import { checkReverseRayAndCapsule } from '../capsule-utils';
import { checkBoxCastAndSegment } from '../box-segment/check-box-cast-and-segment';

/**
 * Casts a moving capsule against a segment by checking both moving circular
 * caps, reverse capsule casts from both segment endpoints, and the moving
 * middle box against the segment when the query capsule has one.
 */
export const checkCapsuleCastAndSegment: ShapeCastCheckerFn<
  CapsuleCastGeometry,
  SegmentGeometry
> = (capsuleCast, segment) => {
  const overlapIntersection = intersectionCheckers.capsule.segment(
    capsuleCast,
    segment,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  let nearest: ShapeCastCheckerHit | false = false;

  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndSegment(capsuleCast.cap1, segment),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndSegment(capsuleCast.cap2, segment),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkReverseRayAndCapsule(capsuleCast, segment.point1),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkReverseRayAndCapsule(capsuleCast, segment.point2),
  );

  if (capsuleCast.box) {
    nearest = chooseNearestIntersection(
      nearest,
      checkBoxCastAndSegment(capsuleCast.box, segment),
    );
  }

  return nearest;
};
