import type { Proxy, Intersection } from '../types';

import { checkBoxAndCircleIntersection } from './box-circle/check-box-and-circle-intersection';
import { checkBoxesIntersection } from './box-box/check-boxes-intersection';
import { checkCirclesIntersection } from './circle-circle/check-circles-intersection';

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
  },
  circle: {
    circle: checkCirclesIntersection,
    box: checkBoxAndCircleIntersection,
  },
};
