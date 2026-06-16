import type { Collider, Transform } from '../../../../../components';
import type { ActorGeometryParams, Geometry } from '../types';

import { buildBoxGeometry } from './build-box-geometry';
import { buildCapsuleGeometry } from './build-capsule-geometry';
import { buildCircleGeometry } from './build-circle-geometry';
import { buildPointGeometry } from './build-point-geometry';
import { buildRayGeometry } from './build-ray-geometry';
import { buildSegmentGeometry } from './build-segment-geometry';
import { buildCircleCastGeometry } from './build-circle-cast-geometry';
import { buildCapsuleCastGeometry } from './build-capsule-cast-geometry';
import { buildBoxCastGeometry } from './build-box-cast-geometry';

export type BuildGeometryFn = (
  collider: Collider,
  transform: Transform,
  params?: ActorGeometryParams,
) => Geometry;

export const geometryBuilders = {
  box: buildBoxGeometry,
  capsule: buildCapsuleGeometry,
  circle: buildCircleGeometry,
  segment: buildSegmentGeometry,
  point: buildPointGeometry,
  ray: buildRayGeometry,
  circleCast: buildCircleCastGeometry,
  capsuleCast: buildCapsuleCastGeometry,
  boxCast: buildBoxCastGeometry,
};
