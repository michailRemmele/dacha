import type { AABB, Geometry } from '../types';

import { buildBoxAABB } from './build-box-aabb';
import { buildCircleAABB } from './build-circle-aabb';
import { buildPointAABB } from './build-point-aabb';
import { buildRayAABB } from './build-ray-aabb';

export type BuildAABBFn = (geometry: Geometry) => AABB;

export const aabbBuilders: Record<string, BuildAABBFn> = {
  box: buildBoxAABB,
  circle: buildCircleAABB,
  point: buildPointAABB,
  ray: buildRayAABB,
};
