import { checkBoxAndCircleIntersection } from './check-box-and-circle-intersection';
import { checkBoxesIntersection } from './check-boxes-intersection';
import { checkCirclesIntersection } from './check-circles-intersection';
import type { IntersectionEntry, Intersection } from './types';

export type { IntersectionEntry, Intersection };

export type CheckIntersectionFn = (
  arg1: IntersectionEntry,
  arg2: IntersectionEntry,
) => Intersection | false;

export const intersectionCheckers: Record<string, Record<string, CheckIntersectionFn>> = {
  boxCollider: {
    boxCollider: checkBoxesIntersection,
    circleCollider: checkBoxAndCircleIntersection,
  },
  circleCollider: {
    circleCollider: checkCirclesIntersection,
    boxCollider: checkBoxAndCircleIntersection,
  },
};
