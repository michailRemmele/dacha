import type { ColliderContainer, Transform } from '../../../../../components';
import type { Geometry } from '../types';

import { buildBoxGeometry } from './build-box-geometry';
import { buildCircleGeometry } from './build-circle-geometry';

export type BuildGeometryFn = (container: ColliderContainer, transform: Transform) => Geometry;

export const geometryBuilders: Record<string, BuildGeometryFn> = {
  boxCollider: buildBoxGeometry,
  circleCollider: buildCircleGeometry,
};
