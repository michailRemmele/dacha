import type { Proxy, Intersection } from '../types';

import { checkBoxAndCircleIntersection } from './box-circle/check-box-and-circle-intersection';
import { checkBoxesIntersection } from './box-box/check-boxes-intersection';
import { checkCirclesIntersection } from './circle-circle/check-circles-intersection';
import { checkPointAndBoxIntersection } from './point-box/check-point-and-box-intersection';
import { checkPointAndCircleIntersection } from './point-circle/check-point-and-circle-intersection';
import { checkRayAndBoxIntersection } from './ray-box/check-ray-and-box-intersection';
import { checkRayAndCircleIntersection } from './ray-circle/check-ray-and-circle-intersection';

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
    point: checkPointAndBoxIntersection,
  },
  circle: {
    circle: checkCirclesIntersection,
    box: checkBoxAndCircleIntersection,
    point: checkPointAndCircleIntersection,
  },
  point: {
    box: checkPointAndBoxIntersection,
    circle: checkPointAndCircleIntersection,
  },
  ray: {
    box: checkRayAndBoxIntersection,
    circle: checkRayAndCircleIntersection,
  },
};
