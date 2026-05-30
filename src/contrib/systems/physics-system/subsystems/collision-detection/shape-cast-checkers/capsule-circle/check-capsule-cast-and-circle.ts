import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import { intersectionCheckers } from '../../intersection-checkers';
import type { CapsuleCastGeometry, CircleGeometry } from '../../types';
import { checkCircleCastAndCircle } from '../circle-circle/check-circle-cast-and-circle';
import type { ShapeCastCheckerFn, ShapeCastCheckerHit } from '../types';
import { buildInitialOverlapHit } from '../utils';
import {
  buildCapCircleCastProxy,
  buildCapsuleBodyBoxCastProxy,
  checkReversePointCastAndCapsule,
} from '../capsule-utils';
import { checkBoxCastAndCircle } from '../box-circle/check-box-cast-and-circle';

export const checkCapsuleCastAndCircle: ShapeCastCheckerFn = (
  queryProxy,
  targetProxy,
) => {
  const overlapIntersection = intersectionCheckers.capsule.circle(
    queryProxy,
    targetProxy,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const capsule = queryProxy.geometry as CapsuleCastGeometry;
  const circle = targetProxy.geometry as CircleGeometry;
  let nearest: ShapeCastCheckerHit | false = false;

  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndCircle(
      buildCapCircleCastProxy(queryProxy, capsule.point1),
      targetProxy,
    ),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndCircle(
      buildCapCircleCastProxy(queryProxy, capsule.point2),
      targetProxy,
    ),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkReversePointCastAndCapsule(queryProxy, circle.center, circle.radius),
  );

  const bodyBoxProxy = buildCapsuleBodyBoxCastProxy(queryProxy);

  if (bodyBoxProxy) {
    nearest = chooseNearestIntersection(
      nearest,
      checkBoxCastAndCircle(bodyBoxProxy, targetProxy),
    );
  }

  return nearest;
};
