import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import { intersectionCheckers } from '../../intersection-checkers';
import type { CapsuleCastGeometry, CapsuleGeometry } from '../../types';
import { checkCircleCastAndCapsule } from '../circle-capsule/check-circle-cast-and-capsule';
import type { ShapeCastCheckerFn, ShapeCastCheckerHit } from '../types';
import { buildInitialOverlapHit } from '../utils';
import { checkReverseRayAndCapsule } from '../capsule-utils';
import { checkBoxCastAndCapsule } from '../box-capsule/check-box-cast-and-capsule';

export const checkCapsuleCastAndCapsule: ShapeCastCheckerFn = (
  query,
  target,
) => {
  const capsule = query as CapsuleCastGeometry;
  const targetCapsule = target as CapsuleGeometry;
  const overlapIntersection = intersectionCheckers.capsule.capsule(
    capsule,
    targetCapsule,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  let nearest: ShapeCastCheckerHit | false = false;

  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndCapsule(capsule.cap1, targetCapsule),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndCapsule(capsule.cap2, targetCapsule),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkReverseRayAndCapsule(
      capsule,
      targetCapsule.point1,
      targetCapsule.radius,
    ),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkReverseRayAndCapsule(
      capsule,
      targetCapsule.point2,
      targetCapsule.radius,
    ),
  );

  if (capsule.box) {
    nearest = chooseNearestIntersection(
      nearest,
      checkBoxCastAndCapsule(capsule.box, targetCapsule),
    );
  }

  return nearest;
};
