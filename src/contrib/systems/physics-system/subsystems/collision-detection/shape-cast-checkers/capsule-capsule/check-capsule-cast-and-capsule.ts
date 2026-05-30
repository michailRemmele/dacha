import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import { intersectionCheckers } from '../../intersection-checkers';
import type { CapsuleCastGeometry, CapsuleGeometry } from '../../types';
import { checkCircleCastAndCapsule } from '../circle-capsule/check-circle-cast-and-capsule';
import type { ShapeCastCheckerFn, ShapeCastCheckerHit } from '../types';
import { buildInitialOverlapHit } from '../utils';
import {
  buildCapCircleCastProxy,
  buildCapsuleBodyBoxCastProxy,
  checkReversePointCastAndCapsule,
} from '../capsule-utils';
import { checkBoxCastAndCapsule } from '../box-capsule/check-box-cast-and-capsule';

export const checkCapsuleCastAndCapsule: ShapeCastCheckerFn = (
  queryProxy,
  targetProxy,
) => {
  const overlapIntersection = intersectionCheckers.capsule.capsule(
    queryProxy,
    targetProxy,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const capsule = queryProxy.geometry as CapsuleCastGeometry;
  const targetCapsule = targetProxy.geometry as CapsuleGeometry;
  let nearest: ShapeCastCheckerHit | false = false;

  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndCapsule(
      buildCapCircleCastProxy(queryProxy, capsule.point1),
      targetProxy,
    ),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndCapsule(
      buildCapCircleCastProxy(queryProxy, capsule.point2),
      targetProxy,
    ),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkReversePointCastAndCapsule(
      queryProxy,
      targetCapsule.point1,
      targetCapsule.radius,
    ),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkReversePointCastAndCapsule(
      queryProxy,
      targetCapsule.point2,
      targetCapsule.radius,
    ),
  );

  const bodyBoxProxy = buildCapsuleBodyBoxCastProxy(queryProxy);

  if (bodyBoxProxy) {
    nearest = chooseNearestIntersection(
      nearest,
      checkBoxCastAndCapsule(bodyBoxProxy, targetProxy),
    );
  }

  return nearest;
};
