import type { Collider, Transform } from '../../../../../components';
import type { Geometry } from '../types';

import { buildBoxGeometry } from './build-box-geometry';
import { buildCapsuleGeometry } from './build-capsule-geometry';
import { buildCircleGeometry } from './build-circle-geometry';
import { buildPointGeometry } from './build-point-geometry';
import { buildRayGeometry } from './build-ray-geometry';
import { buildSegmentGeometry } from './build-segment-geometry';

export type BuildGeometryFn = (
  collider: Collider,
  transform: Transform,
) => Geometry;

export const geometryBuilders = {
  box: buildBoxGeometry,
  capsule: buildCapsuleGeometry,
  circle: buildCircleGeometry,
  segment: buildSegmentGeometry,
  point: buildPointGeometry,
  ray: buildRayGeometry,
};
