import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import { intersectionCheckers } from '../../intersection-checkers';
import type { CapsuleCastGeometry, SegmentGeometry } from '../../types';
import { checkCircleCastAndSegment } from '../circle-segment/check-circle-cast-and-segment';
import type { ShapeCastCheckerFn, ShapeCastCheckerHit } from '../types';
import { buildInitialOverlapHit } from '../utils';
import {
  buildCapCircleCastProxy,
  buildCapsuleBodyBoxCastProxy,
  checkReversePointCastAndCapsule,
} from '../capsule-utils';
import { checkBoxCastAndSegment } from '../box-segment/check-box-cast-and-segment';

export const checkCapsuleCastAndSegment: ShapeCastCheckerFn = (
  queryProxy,
  targetProxy,
) => {
  const overlapIntersection = intersectionCheckers.capsule.segment(
    queryProxy,
    targetProxy,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const capsule = queryProxy.geometry as CapsuleCastGeometry;
  const segment = targetProxy.geometry as SegmentGeometry;
  let nearest: ShapeCastCheckerHit | false = false;

  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndSegment(
      buildCapCircleCastProxy(queryProxy, capsule.point1),
      targetProxy,
    ),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkCircleCastAndSegment(
      buildCapCircleCastProxy(queryProxy, capsule.point2),
      targetProxy,
    ),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkReversePointCastAndCapsule(queryProxy, segment.point1),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkReversePointCastAndCapsule(queryProxy, segment.point2),
  );

  const bodyBoxProxy = buildCapsuleBodyBoxCastProxy(queryProxy);

  if (bodyBoxProxy) {
    nearest = chooseNearestIntersection(
      nearest,
      checkBoxCastAndSegment(bodyBoxProxy, targetProxy),
    );
  }

  return nearest;
};
