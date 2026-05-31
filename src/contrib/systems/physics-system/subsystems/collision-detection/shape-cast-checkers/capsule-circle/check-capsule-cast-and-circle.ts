import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import { intersectionCheckers } from '../../intersection-checkers';
import type { CapsuleCastGeometry, CircleGeometry } from '../../types';
import { checkCircleCastAndCircle } from '../circle-circle/check-circle-cast-and-circle';
import type { ShapeCastCheckerFn, ShapeCastCheckerHit } from '../types';
import { buildInitialOverlapHit } from '../utils';
import { checkReversePointCastAndCapsule } from '../capsule-utils';
import { checkBoxCastAndCircle } from '../box-circle/check-box-cast-and-circle';

export const checkCapsuleCastAndCircle: ShapeCastCheckerFn = (
  query,
  target,
) => {
  const capsule = query as CapsuleCastGeometry;
  const circle = target as CircleGeometry;
  const overlapIntersection = intersectionCheckers.capsule.circle(
    capsule,
    circle,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  let nearest: ShapeCastCheckerHit | false = false;

  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndCircle(capsule.cap1, circle),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndCircle(capsule.cap2, circle),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkReversePointCastAndCapsule(capsule, circle.center, circle.radius),
  );

  if (capsule.box) {
    nearest = chooseNearestIntersection(
      nearest,
      checkBoxCastAndCircle(capsule.box, circle),
    );
  }

  return nearest;
};
