import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import { intersectionCheckers } from '../../intersection-checkers';
import type { BoxGeometry, CapsuleCastGeometry } from '../../types';
import { checkCircleCastAndBox } from '../circle-box/check-circle-cast-and-box';
import type { ShapeCastCheckerFn, ShapeCastCheckerHit } from '../types';
import { buildInitialOverlapHit } from '../utils';
import { checkReverseRayAndCapsule } from '../capsule-utils';
import { checkBoxCastAndBox } from '../box-box/check-box-cast-and-box';

/**
 * Casts a moving capsule against a box by decomposing the capsule sweep into
 * both moving circular caps, reverse capsule casts from every box corner, and
 * the moving middle box when the capsule has a non-zero cylindrical section.
 */
export const checkCapsuleCastAndBox: ShapeCastCheckerFn<
  CapsuleCastGeometry,
  BoxGeometry
> = (capsuleCast, box) => {
  const overlapIntersection = intersectionCheckers.capsule.box(
    capsuleCast,
    box,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  let nearest: ShapeCastCheckerHit | false = false;

  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndBox(capsuleCast.cap1, box),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndBox(capsuleCast.cap2, box),
  );

  for (const point of box.points) {
    nearest = chooseNearestIntersection(
      nearest,
      checkReverseRayAndCapsule(capsuleCast, point),
    );
  }

  if (capsuleCast.box) {
    nearest = chooseNearestIntersection(
      nearest,
      checkBoxCastAndBox(capsuleCast.box, box),
    );
  }

  return nearest;
};
