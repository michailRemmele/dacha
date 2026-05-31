import { intersectionCheckers } from '../../intersection-checkers';
import type { BoxCastGeometry, CapsuleGeometry } from '../../types';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';
import {
  checkBoxCastAndCapsuleGeometry,
  correctContactPoint,
} from '../box-utils';

export const checkBoxCastAndCapsule: ShapeCastCheckerFn = (
  query,
  target,
) => {
  const box = query as BoxCastGeometry;
  const capsule = target as CapsuleGeometry;
  const overlapIntersection = intersectionCheckers.box.capsule(
    box,
    capsule,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const hit = checkBoxCastAndCapsuleGeometry(box, capsule);

  correctContactPoint(box, hit);

  return hit;
};
