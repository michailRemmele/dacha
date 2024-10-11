import type { ColliderContainer } from '../../../../../components';
import type { AABB, Geometry } from '../types';

import { buildBoxAABB } from './build-box-aabb';
import { buildCircleAABB } from './build-circle-aabb';

export type BuildAABBFn = (container: ColliderContainer, geometry: Geometry) => AABB;

export const aabbBuilders: Record<string, BuildAABBFn> = {
  boxCollider: buildBoxAABB,
  circleCollider: buildCircleAABB,
};
