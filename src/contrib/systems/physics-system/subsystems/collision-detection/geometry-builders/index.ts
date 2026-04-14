import type { Collider, Transform } from '../../../../../components';
import type { Geometry } from '../types';

import { buildBoxGeometry } from './build-box-geometry';
import { buildCircleGeometry } from './build-circle-geometry';
import { buildPointGeometry } from './build-point-geometry';
import { buildRayGeometry } from './build-ray-geometry';

export type BuildGeometryFn = (
  collider: Collider,
  transform: Transform,
) => Geometry;

export const geometryBuilders = {
  box: buildBoxGeometry,
  circle: buildCircleGeometry,
  point: buildPointGeometry,
  ray: buildRayGeometry,
};
