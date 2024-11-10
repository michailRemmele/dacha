import type { CollisionEntry, Intersection } from '../types';

import { checkBoxAndCircleIntersection } from './check-box-and-circle-intersection';
import { checkBoxesIntersection } from './check-boxes-intersection';
import { checkCirclesIntersection } from './check-circles-intersection';

export type CheckIntersectionFn = (
  arg1: CollisionEntry,
  arg2: CollisionEntry,
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
