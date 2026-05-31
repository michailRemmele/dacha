import type { Geometry, Intersection } from '../types';

import { checkBoxAndCapsuleIntersection } from './box-capsule/check-box-and-capsule-intersection';
import { checkBoxAndCircleIntersection } from './box-circle/check-box-and-circle-intersection';
import { checkBoxAndSegmentIntersection } from './box-segment/check-box-and-segment-intersection';
import { checkBoxesIntersection } from './box-box/check-boxes-intersection';
import { checkCapsulesIntersection } from './capsule-capsule/check-capsules-intersection';
import { checkCircleAndCapsuleIntersection } from './circle-capsule/check-circle-and-capsule-intersection';
import { checkCirclesIntersection } from './circle-circle/check-circles-intersection';
import { checkCircleAndSegmentIntersection } from './circle-segment/check-circle-and-segment-intersection';
import { checkPointAndBoxIntersection } from './point-box/check-point-and-box-intersection';
import { checkPointAndCapsuleIntersection } from './point-capsule/check-point-and-capsule-intersection';
import { checkPointAndCircleIntersection } from './point-circle/check-point-and-circle-intersection';
import { checkPointAndSegmentIntersection } from './point-segment/check-point-and-segment-intersection';
import { checkSegmentAndCapsuleIntersection } from './segment-capsule/check-segment-and-capsule-intersection';

export type CheckIntersectionFn = (
  arg1: Geometry,
  arg2: Geometry,
) => Intersection | false;

const swapArgs = <T, U>(
  checker: (arg1: T, arg2: U) => Intersection | false,
): CheckIntersectionFn => {
  return (arg1: unknown, arg2: unknown) => {
    const intersection = checker(arg2 as T, arg1 as U);

    if (!intersection) {
      return false;
    }

    intersection.normal.multiplyNumber(-1);

    return intersection;
  };
};

export const intersectionCheckers = {
  box: {
    box: checkBoxesIntersection,
    capsule: checkBoxAndCapsuleIntersection,
    circle: checkBoxAndCircleIntersection,
    segment: checkBoxAndSegmentIntersection,
  },
  capsule: {
    box: swapArgs(checkBoxAndCapsuleIntersection),
    capsule: checkCapsulesIntersection,
    circle: swapArgs(checkCircleAndCapsuleIntersection),
    segment: swapArgs(checkSegmentAndCapsuleIntersection),
  },
  circle: {
    capsule: checkCircleAndCapsuleIntersection,
    circle: checkCirclesIntersection,
    box: swapArgs(checkBoxAndCircleIntersection),
    segment: checkCircleAndSegmentIntersection,
  },
  segment: {
    box: swapArgs(checkBoxAndSegmentIntersection),
    capsule: checkSegmentAndCapsuleIntersection,
    circle: swapArgs(checkCircleAndSegmentIntersection),
  },
  point: {
    box: checkPointAndBoxIntersection,
    capsule: checkPointAndCapsuleIntersection,
    circle: checkPointAndCircleIntersection,
    segment: checkPointAndSegmentIntersection,
  },
} as Record<string, Record<string, CheckIntersectionFn>>;
