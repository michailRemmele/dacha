import { BoxAABBBuilder } from './box-aabb-builder';
import { CircleAABBBuilder } from './circle-aabb-builder';
import type { AABBBuilder } from './aabb-builder';

export type { AABBBuilder };
export type { AABB } from './aabb';

export const aabbBuilders: Record<string, { new(): AABBBuilder }> = {
  boxCollider: BoxAABBBuilder,
  circleCollider: CircleAABBBuilder,
};
