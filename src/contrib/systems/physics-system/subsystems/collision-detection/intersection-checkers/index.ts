import { BoxesIntersectionChecker } from './boxes-intersection-checker';
import { CirclesIntersectionChecker } from './circles-intersection-checker';
import { BoxAndCircleIntersectionChecker } from './box-and-circle-intersection-checker';
import type { IntersectionChecker, IntersectionEntry, Intersection } from './intersection-checker';

export type { IntersectionChecker, IntersectionEntry, Intersection };

export const intersectionCheckers: Record<string, { new(): IntersectionChecker }> = {
  boxCollider_boxCollider: BoxesIntersectionChecker,
  circleCollider_circleCollider: CirclesIntersectionChecker,
  circleCollider_boxCollider: BoxAndCircleIntersectionChecker,
  boxCollider_circleCollider: BoxAndCircleIntersectionChecker,
};
