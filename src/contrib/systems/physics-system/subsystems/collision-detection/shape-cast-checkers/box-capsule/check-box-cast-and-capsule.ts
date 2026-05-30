import { intersectionCheckers } from '../../intersection-checkers';
import type { CapsuleGeometry } from '../../types';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';
import {
  checkBoxCastAndCapsuleGeometry,
  correctContactPoint,
} from '../box-utils';

export const checkBoxCastAndCapsule: ShapeCastCheckerFn = (
  queryProxy,
  targetProxy,
) => {
  const overlapIntersection = intersectionCheckers.box.capsule(
    queryProxy,
    targetProxy,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const hit = checkBoxCastAndCapsuleGeometry(
    queryProxy,
    targetProxy.geometry as CapsuleGeometry,
  );

  correctContactPoint(queryProxy, hit);

  return hit;
};
