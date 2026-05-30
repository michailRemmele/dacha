import { raycastCheckers } from '../raycast-checkers';
import { buildBoxCastGeometry } from '../geometry-builders/build-box-cast-geometry';
import { isDefinitelyPositive, isZero } from '../utils';
import type {
  CapsuleCastGeometry,
  CapsuleGeometry,
  Point,
  QueryProxy,
} from '../types';
import type { ShapeCastCheckerHit } from './types';

export const buildCapCircleCastProxy = (
  queryProxy: QueryProxy,
  center: Point,
): QueryProxy => {
  const capsule = queryProxy.geometry as CapsuleCastGeometry;

  return {
    aabb: queryProxy.aabb,
    geometry: {
      center,
      origin: center,
      radius: capsule.radius,
      direction: capsule.direction,
      maxDistance: capsule.maxDistance,
    },
    layer: queryProxy.layer,
  };
};

export const checkReversePointCastAndCapsule = (
  queryProxy: QueryProxy,
  point: Point,
  targetRadius = 0,
): ShapeCastCheckerHit | false => {
  const capsule = queryProxy.geometry as CapsuleCastGeometry;
  const inflatedCapsule: CapsuleGeometry = {
    center: capsule.center,
    point1: capsule.point1,
    point2: capsule.point2,
    normal: capsule.normal,
    radius: capsule.radius + targetRadius,
  };
  const rayProxy: QueryProxy = {
    aabb: queryProxy.aabb,
    geometry: {
      origin: point,
      direction: capsule.direction.clone().multiplyNumber(-1),
      maxDistance: capsule.maxDistance,
    },
    layer: queryProxy.layer,
  };
  const capsuleProxy: QueryProxy = {
    aabb: queryProxy.aabb,
    geometry: inflatedCapsule,
    layer: queryProxy.layer,
  };
  const hit = raycastCheckers.ray.capsule(rayProxy, capsuleProxy);

  if (!hit) {
    return false;
  }

  const normal = hit.normal.multiplyNumber(-1);

  return {
    distance: hit.distance,
    normal,
    point: {
      x: point.x + normal.x * targetRadius,
      y: point.y + normal.y * targetRadius,
    },
  };
};

export const buildCapsuleBodyBoxCastProxy = (
  queryProxy: QueryProxy,
): QueryProxy | null => {
  const capsule = queryProxy.geometry as CapsuleCastGeometry;
  const sizeX = isZero(capsule.point2.x - capsule.point1.x)
    ? capsule.radius * 2
    : Math.abs(capsule.point2.x - capsule.point1.x);
  const sizeY = isZero(capsule.point2.y - capsule.point1.y)
    ? capsule.radius * 2
    : Math.abs(capsule.point2.y - capsule.point1.y);

  if (!isDefinitelyPositive(sizeX) || !isDefinitelyPositive(sizeY)) {
    return null;
  }

  return {
    aabb: queryProxy.aabb,
    geometry: buildBoxCastGeometry({
      shape: {
        type: 'box',
        center: capsule.center,
        size: { x: sizeX, y: sizeY },
      },
      direction: capsule.direction,
      maxDistance: capsule.maxDistance,
      layer: queryProxy.layer,
    }),
    layer: queryProxy.layer,
  };
};
