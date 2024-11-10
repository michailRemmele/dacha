import type { AABB, Geometry } from '../types';

import { buildBoxAABB } from './build-box-aabb';
import { buildCircleAABB } from './build-circle-aabb';

export type BuildAABBFn = (geometry: Geometry) => AABB;

export const aabbBuilders: Record<string, BuildAABBFn> = {
  boxCollider: buildBoxAABB,
  circleCollider: buildCircleAABB,
};
