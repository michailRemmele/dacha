import { intersectionCheckers } from '../../intersection-checkers';
import type { BoxCastGeometry, CapsuleGeometry } from '../../types';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';
import { correctContactPoint } from '../box-utils';
import { checkBoxCastAndCapsuleGeometry } from './utils';

/**
 * Casts a moving box against a capsule by delegating to the box-capsule helper:
 * the capsule segment is expanded by the box half-extents, the capsule caps are
 * checked as circles, and the nearest hit is converted back to the moving box
 * support point.
 */
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
