import { Vector2, VectorOps } from '../../../../../../../engine/math-lib';
import { Collider, Transform } from '../../../../../../components';
import { buildBoxGeometry } from '../../geometry-builders/build-box-geometry';
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
  RayGeometry,
  SegmentGeometry,
} from '../../types';
import type { RaycastCheckerHit } from '../../raycast-checkers/types';
import { expectHit } from '../../tests/assertions';

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
    shape: {
      type: 'box',
      center: { x: centerX, y: centerY },
      size: { x: sizeX, y: sizeY },
      rotation,
    },
  });
};

export const createCircleGeometry = (
  centerX: number,
  centerY: number,
  radius: number,
): CircleGeometry =>
  buildCircleGeometry({
    shape: {
      type: 'circle',
      center: { x: centerX, y: centerY },
      radius,
    },
  });

export const createCapsuleGeometry = (
  point1X: number,
  point1Y: number,
  point2X: number,
  point2Y: number,
  radius: number,
): CapsuleGeometry => {
  const point1 = { x: point1X, y: point1Y };
  const point2 = { x: point2X, y: point2Y };

  return {
    center: {
      x: (point1X + point2X) / 2,
      y: (point1Y + point2Y) / 2,
    },
    point1,
    point2,
    normal: VectorOps.getNormal(point1X, point2X, point1Y, point2Y),
    radius,
  };
};

export const createSegmentGeometry = (
  point1X: number,
  point1Y: number,
  point2X: number,
  point2Y: number,
): SegmentGeometry =>
  buildSegmentGeometry(
    new Collider({
      type: 'segment',
      offsetX: 0,
      offsetY: 0,
      point1X,
      point1Y,
      point2X,
      point2Y,
      layer: 'default',
      disabled: false,
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
    shape: {
      type: 'point',
      point: { x: centerX, y: centerY },
    },
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
): Intersection => expectHit(intersection, 'intersection');

export const expectCastHit = (
  hit: RaycastCheckerHit | false,
): RaycastCheckerHit => expectHit(hit, 'cast hit');

export const sortPoints = (
  points: { x: number; y: number }[],
): { x: number; y: number }[] =>
  [...points].sort((point1, point2) => {
    if (point1.x !== point2.x) {
      return point1.x - point2.x;
    }

    return point1.y - point2.y;
  });
