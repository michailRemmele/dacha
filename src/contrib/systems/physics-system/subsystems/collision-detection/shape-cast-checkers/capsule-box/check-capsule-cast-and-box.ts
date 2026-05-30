import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import { intersectionCheckers } from '../../intersection-checkers';
import type { BoxGeometry, CapsuleCastGeometry } from '../../types';
import { checkCircleCastAndBox } from '../circle-box/check-circle-cast-and-box';
import type { ShapeCastCheckerFn, ShapeCastCheckerHit } from '../types';
import { buildInitialOverlapHit } from '../utils';
import {
  buildCapCircleCastProxy,
  buildCapsuleBodyBoxCastProxy,
  checkReversePointCastAndCapsule,
} from '../capsule-utils';
import { checkBoxCastAndBox } from '../box-box/check-box-cast-and-box';

export const checkCapsuleCastAndBox: ShapeCastCheckerFn = (
  queryProxy,
  targetProxy,
) => {
  const overlapIntersection = intersectionCheckers.capsule.box(
    queryProxy,
    targetProxy,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const capsule = queryProxy.geometry as CapsuleCastGeometry;
  const box = targetProxy.geometry as BoxGeometry;
  let nearest: ShapeCastCheckerHit | false = false;

  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndBox(
      buildCapCircleCastProxy(queryProxy, capsule.point1),
      targetProxy,
    ),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndBox(
      buildCapCircleCastProxy(queryProxy, capsule.point2),
      targetProxy,
    ),
  );

  for (const point of box.points) {
    nearest = chooseNearestIntersection(
      nearest,
      checkReversePointCastAndCapsule(queryProxy, point),
    );
  }

  const bodyBoxProxy = buildCapsuleBodyBoxCastProxy(queryProxy);

  if (bodyBoxProxy) {
    nearest = chooseNearestIntersection(
      nearest,
      checkBoxCastAndBox(bodyBoxProxy, targetProxy),
    );
  }

  return nearest;
};
