import type { AABB, Geometry } from '../types';

import { buildBoxAABB } from './build-box-aabb';
import { buildCapsuleAABB } from './build-capsule-aabb';
import { buildCircleAABB } from './build-circle-aabb';
import { buildPointAABB } from './build-point-aabb';
import { buildRayAABB } from './build-ray-aabb';
import { buildSegmentAABB } from './build-segment-aabb';

export type BuildAABBFn = (geometry: Geometry) => AABB;

export const aabbBuilders: Record<string, BuildAABBFn> = {
  box: buildBoxAABB,
  capsule: buildCapsuleAABB,
  circle: buildCircleAABB,
  segment: buildSegmentAABB,
  point: buildPointAABB,
  ray: buildRayAABB,
};
