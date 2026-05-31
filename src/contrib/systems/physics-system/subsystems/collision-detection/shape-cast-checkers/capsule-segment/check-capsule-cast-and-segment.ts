import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import { intersectionCheckers } from '../../intersection-checkers';
import type { CapsuleCastGeometry, SegmentGeometry } from '../../types';
import { checkCircleCastAndSegment } from '../circle-segment/check-circle-cast-and-segment';
import type { ShapeCastCheckerFn, ShapeCastCheckerHit } from '../types';
import { buildInitialOverlapHit } from '../utils';
import { checkReversePointCastAndCapsule } from '../capsule-utils';
import { checkBoxCastAndSegment } from '../box-segment/check-box-cast-and-segment';

export const checkCapsuleCastAndSegment: ShapeCastCheckerFn = (
  query,
  target,
) => {
  const capsule = query as CapsuleCastGeometry;
  const segment = target as SegmentGeometry;
  const overlapIntersection = intersectionCheckers.capsule.segment(
    capsule,
    segment,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  let nearest: ShapeCastCheckerHit | false = false;

  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndSegment(capsule.cap1, segment),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndSegment(capsule.cap2, segment),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkReversePointCastAndCapsule(capsule, segment.point1),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkReversePointCastAndCapsule(capsule, segment.point2),
  );

  if (capsule.box) {
    nearest = chooseNearestIntersection(
      nearest,
      checkBoxCastAndSegment(capsule.box, segment),
    );
  }

  return nearest;
};
