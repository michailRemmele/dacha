import type { Vector2 } from '../../../../../../../engine/math-lib';
import type { Point } from '../../types';
import { isZero } from '../../utils';

export const isSamePoint = (point1: Point, point2: Point): boolean =>
  isZero(point1.x - point2.x) && isZero(point1.y - point2.y);

export const getCrossProduct = (
  origin: Point,
  point1: Point,
  point2: Point,
): number =>
  (point1.x - origin.x) * (point2.y - origin.y) -
  (point1.y - origin.y) * (point2.x - origin.x);

export const getSquaredDistance = (point1: Point, point2: Point): number =>
  (point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2;

export const setNormal = (
  normal: Vector2,
  point1: Point,
  point2: Point,
): void => {
  normal.x = point1.y - point2.y;
  normal.y = point2.x - point1.x;
  normal.normalize();
};
