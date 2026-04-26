import { Vector2 } from '../../../../../../../engine/math-lib';
import { Collider, Transform } from '../../../../../../components';
import { buildBoxGeometry } from '../../geometry-builders/build-box-geometry';
import { buildCapsuleGeometry } from '../../geometry-builders/build-capsule-geometry';
import { buildCircleGeometry } from '../../geometry-builders/build-circle-geometry';
import { buildPointGeometry } from '../../geometry-builders/build-point-geometry';
import { buildRayGeometry } from '../../geometry-builders/build-ray-geometry';
import { buildSegmentGeometry } from '../../geometry-builders/build-segment-geometry';
import type {
  BoxGeometry,
  CapsuleGeometry,
  CircleGeometry,
  Intersection,
  PointGeometry,
  Proxy,
  RayGeometry,
  SegmentGeometry,
} from '../../types';

export const createBoxGeometry = (
  centerX: number,
  centerY: number,
  sizeX: number,
  sizeY: number,
): BoxGeometry => {
  return createRotatedBoxGeometry(centerX, centerY, sizeX, sizeY, 0);
};

export const createRotatedBoxGeometry = (
  centerX: number,
  centerY: number,
  sizeX: number,
  sizeY: number,
  rotation: number,
): BoxGeometry => {
  return buildBoxGeometry({
    center: { x: centerX, y: centerY },
    size: { x: sizeX, y: sizeY },
    rotation,
  });
};

export const createCircleGeometry = (
  centerX: number,
  centerY: number,
  radius: number,
): CircleGeometry =>
  buildCircleGeometry({
    center: { x: centerX, y: centerY },
    radius,
  });

export const createCapsuleGeometry = (
  point1X: number,
  point1Y: number,
  point2X: number,
  point2Y: number,
  radius: number,
): CapsuleGeometry =>
  buildCapsuleGeometry(
    new Collider({
      type: 'capsule',
      centerX: 0,
      centerY: 0,
      point1X,
      point1Y,
      point2X,
      point2Y,
      radius,
      layer: 'default',
    }),
    new Transform({
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    }),
  );

export const createSegmentGeometry = (
  point1X: number,
  point1Y: number,
  point2X: number,
  point2Y: number,
): SegmentGeometry =>
  buildSegmentGeometry(
    new Collider({
      type: 'segment',
      centerX: 0,
      centerY: 0,
      point1X,
      point1Y,
      point2X,
      point2Y,
      layer: 'default',
    }),
    new Transform({
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    }),
  );

export const createPointGeometry = (
  centerX: number,
  centerY: number,
): PointGeometry =>
  buildPointGeometry({
    point: { x: centerX, y: centerY },
  });

export const createRayGeometry = (
  originX: number,
  originY: number,
  directionX: number,
  directionY: number,
  maxDistance: number,
): RayGeometry =>
  buildRayGeometry({
    origin: { x: originX, y: originY },
    direction: new Vector2(directionX, directionY),
    maxDistance,
  });

export const createProxy = (
  geometry:
    | BoxGeometry
    | CapsuleGeometry
    | CircleGeometry
    | SegmentGeometry
    | PointGeometry
    | RayGeometry,
): Proxy =>
  ({
    geometry,
  }) as unknown as Proxy;

export const expectToBeClose = (
  point: { x: number; y: number },
  x: number,
  y: number,
  digits = 6,
): void => {
  expect(point.x).toBeCloseTo(x, digits);
  expect(point.y).toBeCloseTo(y, digits);
};

export const expectIntersection = (
  intersection: Intersection | false,
): Intersection => {
  expect(intersection).not.toBe(false);

  if (intersection === false) {
    throw new Error('Expected intersection, received false');
  }

  return intersection;
};

export const sortPoints = (
  points: { x: number; y: number }[],
): { x: number; y: number }[] =>
  [...points].sort((point1, point2) => {
    if (point1.x !== point2.x) {
      return point1.x - point2.x;
    }

    return point1.y - point2.y;
  });
