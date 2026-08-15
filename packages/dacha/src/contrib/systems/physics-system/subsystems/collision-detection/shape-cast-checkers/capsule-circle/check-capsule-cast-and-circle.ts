import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import { intersectionCheckers } from '../../intersection-checkers';
import type { CapsuleCastGeometry, CircleGeometry } from '../../types';
import { checkCircleCastAndCircle } from '../circle-circle/check-circle-cast-and-circle';
import type { ShapeCastCheckerFn, ShapeCastCheckerHit } from '../types';
import { buildInitialOverlapHit } from '../utils';
import { checkReverseRayAndCapsule } from '../capsule-utils';
import { checkBoxCastAndCircle } from '../box-circle/check-box-cast-and-circle';

/**
 * Casts a moving capsule against a circle by checking both moving circular caps,
 * a reverse capsule cast from the target circle center with radius offset, and
 * the moving middle box against the circle when the query capsule has one.
 */
export const checkCapsuleCastAndCircle: ShapeCastCheckerFn<
  CapsuleCastGeometry,
  CircleGeometry
> = (capsuleCast, circle) => {
  const overlapIntersection = intersectionCheckers.capsule.circle(
    capsuleCast,
    circle,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  let nearest: ShapeCastCheckerHit | false = false;

  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndCircle(capsuleCast.cap1, circle),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndCircle(capsuleCast.cap2, circle),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkReverseRayAndCapsule(capsuleCast, circle.center, circle.radius),
  );

  if (capsuleCast.box) {
    nearest = chooseNearestIntersection(
      nearest,
      checkBoxCastAndCircle(capsuleCast.box, circle),
    );
  }

  return nearest;
};
