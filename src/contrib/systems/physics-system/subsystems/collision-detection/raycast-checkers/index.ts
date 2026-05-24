import type { RaycastCheckerFn } from './types';
import { checkRayAndBoxIntersection } from './ray-box/check-ray-and-box-intersection';
import { checkRayAndCircleIntersection } from './ray-circle/check-ray-and-circle-intersection';
import { checkRayAndCapsuleIntersection } from './ray-capsule/check-ray-and-capsule-intersection';
import { checkRayAndSegmentIntersection } from './ray-segment/check-ray-and-segment-intersection';

export const raycastCheckers: Record<
  string,
  Record<string, RaycastCheckerFn>
> = {
  ray: {
    box: checkRayAndBoxIntersection,
    capsule: checkRayAndCapsuleIntersection,
    circle: checkRayAndCircleIntersection,
    segment: checkRayAndSegmentIntersection,
  },
};
