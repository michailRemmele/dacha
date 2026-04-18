import type { Proxy, Intersection } from '../types';

import { checkBoxAndCircleIntersection } from './box-circle/check-box-and-circle-intersection';
import { checkBoxAndSegmentIntersection } from './box-segment/check-box-and-segment-intersection';
import { checkBoxesIntersection } from './box-box/check-boxes-intersection';
import { checkCirclesIntersection } from './circle-circle/check-circles-intersection';
import { checkCircleAndSegmentIntersection } from './circle-segment/check-circle-and-segment-intersection';
import { checkPointAndBoxIntersection } from './point-box/check-point-and-box-intersection';
import { checkPointAndCircleIntersection } from './point-circle/check-point-and-circle-intersection';
import { checkPointAndSegmentIntersection } from './point-segment/check-point-and-segment-intersection';
import { checkRayAndBoxIntersection } from './ray-box/check-ray-and-box-intersection';
import { checkRayAndCircleIntersection } from './ray-circle/check-ray-and-circle-intersection';
import { checkRayAndSegmentIntersection } from './ray-segment/check-ray-and-segment-intersection';

export type CheckIntersectionFn = (
  arg1: Proxy,
  arg2: Proxy,
) => Intersection | false;

export const intersectionCheckers: Record<
  string,
  Record<string, CheckIntersectionFn>
> = {
  box: {
    box: checkBoxesIntersection,
    circle: checkBoxAndCircleIntersection,
    segment: checkBoxAndSegmentIntersection,
  },
  circle: {
    circle: checkCirclesIntersection,
    box: checkBoxAndCircleIntersection,
    segment: checkCircleAndSegmentIntersection,
  },
  segment: {
    box: checkBoxAndSegmentIntersection,
    circle: checkCircleAndSegmentIntersection,
  },
  point: {
    box: checkPointAndBoxIntersection,
    circle: checkPointAndCircleIntersection,
    segment: checkPointAndSegmentIntersection,
  },
  ray: {
    box: checkRayAndBoxIntersection,
    circle: checkRayAndCircleIntersection,
    segment: checkRayAndSegmentIntersection,
  },
};
