import { intersectionCheckers } from '../../intersection-checkers';
import type { BoxCastGeometry, CapsuleGeometry } from '../../types';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';
import {
  checkBoxCastAndCapsuleGeometry,
  correctContactPoint,
} from '../box-utils';

export const checkBoxCastAndCapsule: ShapeCastCheckerFn<
  BoxCastGeometry,
  CapsuleGeometry
> = (boxCast, capsule) => {
  const overlapIntersection = intersectionCheckers.box.capsule(
    boxCast,
    capsule,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const hit = checkBoxCastAndCapsuleGeometry(boxCast, capsule);

  correctContactPoint(boxCast, hit);

  return hit;
};
