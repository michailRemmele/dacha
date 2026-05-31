import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import { intersectionCheckers } from '../../intersection-checkers';
import type { BoxGeometry, CapsuleCastGeometry } from '../../types';
import { checkCircleCastAndBox } from '../circle-box/check-circle-cast-and-box';
import type { ShapeCastCheckerFn, ShapeCastCheckerHit } from '../types';
import { buildInitialOverlapHit } from '../utils';
import { checkReverseRayAndCapsule } from '../capsule-utils';
import { checkBoxCastAndBox } from '../box-box/check-box-cast-and-box';

export const checkCapsuleCastAndBox: ShapeCastCheckerFn = (query, target) => {
  const capsule = query as CapsuleCastGeometry;
  const box = target as BoxGeometry;
  const overlapIntersection = intersectionCheckers.capsule.box(capsule, box);

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  let nearest: ShapeCastCheckerHit | false = false;

  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndBox(capsule.cap1, box),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndBox(capsule.cap2, box),
  );

  for (const point of box.points) {
    nearest = chooseNearestIntersection(
      nearest,
      checkReverseRayAndCapsule(capsule, point),
    );
  }

  if (capsule.box) {
    nearest = chooseNearestIntersection(
      nearest,
      checkBoxCastAndBox(capsule.box, box),
    );
  }

  return nearest;
};
