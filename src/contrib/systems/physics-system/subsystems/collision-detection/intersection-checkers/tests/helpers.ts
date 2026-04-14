import { Vector2, VectorOps } from '../../../../../../../engine/math-lib';
import type {
  BoxGeometry,
  CircleGeometry,
  Intersection,
  PointGeometry,
  Proxy,
  RayGeometry,
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
  const halfX = sizeX / 2;
  const halfY = sizeY / 2;
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);

  const points = [
    { x: -halfX, y: -halfY },
    { x: -halfX, y: halfY },
    { x: halfX, y: halfY },
    { x: halfX, y: -halfY },
  ];

  for (const point of points) {
    const rotatedX = point.x * cos - point.y * sin;
    const rotatedY = point.x * sin + point.y * cos;

    point.x = rotatedX + centerX;
    point.y = rotatedY + centerY;
  }

  const edges = points.map((point1, index, array) => {
    const point2 = array[(index + 1) % array.length];

    return {
      point1,
      point2,
      normal: VectorOps.getNormal(point1.x, point2.x, point1.y, point2.y),
    };
  });

  return {
    center: {
      x: centerX,
      y: centerY,
    },
    points,
    edges,
  };
};

export const createCircleGeometry = (
  centerX: number,
  centerY: number,
  radius: number,
): CircleGeometry => ({
  center: { x: centerX, y: centerY },
  radius,
});

export const createPointGeometry = (
  centerX: number,
  centerY: number,
): PointGeometry => ({
  center: { x: centerX, y: centerY },
});

export const createRayGeometry = (
  originX: number,
  originY: number,
  directionX: number,
  directionY: number,
  maxDistance: number,
): RayGeometry => ({
  origin: { x: originX, y: originY },
  direction: new Vector2(directionX, directionY).normalize(),
  maxDistance,
});

export const createProxy = (
  geometry: BoxGeometry | CircleGeometry | PointGeometry | RayGeometry,
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
