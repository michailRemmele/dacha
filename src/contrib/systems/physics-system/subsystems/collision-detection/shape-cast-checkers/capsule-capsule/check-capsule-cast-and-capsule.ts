import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import { intersectionCheckers } from '../../intersection-checkers';
import type { CapsuleCastGeometry, CapsuleGeometry } from '../../types';
import { checkCircleCastAndCapsule } from '../circle-capsule/check-circle-cast-and-capsule';
import type { ShapeCastCheckerFn, ShapeCastCheckerHit } from '../types';
import { buildInitialOverlapHit } from '../utils';
import { checkReverseRayAndCapsule } from '../capsule-utils';
import { checkBoxCastAndCapsule } from '../box-capsule/check-box-cast-and-capsule';

export const checkCapsuleCastAndCapsule: ShapeCastCheckerFn<
  CapsuleCastGeometry,
  CapsuleGeometry
> = (capsuleCast, capsule) => {
  const overlapIntersection = intersectionCheckers.capsule.capsule(
    capsuleCast,
    capsule,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  let nearest: ShapeCastCheckerHit | false = false;

  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndCapsule(capsuleCast.cap1, capsule),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndCapsule(capsuleCast.cap2, capsule),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkReverseRayAndCapsule(capsuleCast, capsule.point1, capsule.radius),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkReverseRayAndCapsule(capsuleCast, capsule.point2, capsule.radius),
  );

  if (capsuleCast.box) {
    nearest = chooseNearestIntersection(
      nearest,
      checkBoxCastAndCapsule(capsuleCast.box, capsule),
    );
  }

  return nearest;
};
