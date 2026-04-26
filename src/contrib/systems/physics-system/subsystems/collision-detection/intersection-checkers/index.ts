import type { Proxy, Intersection } from '../types';

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
import { checkRayAndBoxIntersection } from './ray-box/check-ray-and-box-intersection';
import { checkRayAndCapsuleIntersection } from './ray-capsule/check-ray-and-capsule-intersection';
import { checkRayAndCircleIntersection } from './ray-circle/check-ray-and-circle-intersection';
import { checkRayAndSegmentIntersection } from './ray-segment/check-ray-and-segment-intersection';
import { checkSegmentAndCapsuleIntersection } from './segment-capsule/check-segment-and-capsule-intersection';

export type CheckIntersectionFn = (
  arg1: Proxy,
  arg2: Proxy,
) => Intersection | false;

const swapArgs = (checker: CheckIntersectionFn): CheckIntersectionFn => {
  return (arg1, arg2) => {
    const intersection = checker(arg2, arg1);

    if (!intersection) {
      return false;
    }

    intersection.normal.multiplyNumber(-1);

    return intersection;
  };
};

export const intersectionCheckers: Record<
  string,
  Record<string, CheckIntersectionFn>
> = {
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
  ray: {
    box: checkRayAndBoxIntersection,
    capsule: checkRayAndCapsuleIntersection,
    circle: checkRayAndCircleIntersection,
    segment: checkRayAndSegmentIntersection,
  },
};
