import { VectorOps } from '../../../../../../engine/math-lib';
import { chooseNearestIntersection } from '../intersection-checkers/common/cast';
import { raycastCheckers } from '../raycast-checkers';
import type { RaycastCheckerHit } from '../raycast-checkers/types';
import { isDefinitelyPositive, isZero } from '../utils';
import type {
  BoxCastGeometry,
  BoxGeometry,
  CapsuleGeometry,
  EdgeWithNormal,
  Point,
  QueryProxy,
} from '../types';

import { normalizeValue } from './utils';
import type { ShapeCastCheckerHit } from './types';

const BOX_CORNER_SIGNS = [
  [-1, -1],
  [-1, 1],
  [1, 1],
  [1, -1],
] as const;

const getConvexPoints = (points: Point[]): Point[] => {
  points.sort((point1, point2) => {
    if (point1.x === point2.x) {
      return point1.y - point2.y;
    }

    return point1.x - point2.x;
  });

  let uniqueLength = 0;

  for (const point of points) {
    const previous = points[uniqueLength - 1];

    if (
      uniqueLength === 0 ||
      !isZero(point.x - previous.x) ||
      !isZero(point.y - previous.y)
    ) {
      points[uniqueLength] = point;
      uniqueLength += 1;
    }
  }

  points.length = uniqueLength;

  if (points.length <= 1) {
    return points;
  }

  const cross = (origin: Point, point1: Point, point2: Point): number =>
    (point1.x - origin.x) * (point2.y - origin.y) -
    (point1.y - origin.y) * (point2.x - origin.x);

  const lower: Point[] = [];

  for (const point of points) {
    while (
      lower.length >= 2 &&
      !isDefinitelyPositive(
        cross(lower[lower.length - 2], lower[lower.length - 1], point),
      )
    ) {
      lower.pop();
    }

    lower.push(point);
  }

  const upper: Point[] = [];

  for (let i = points.length - 1; i >= 0; i -= 1) {
    const point = points[i];

    while (
      upper.length >= 2 &&
      !isDefinitelyPositive(
        cross(upper[upper.length - 2], upper[upper.length - 1], point),
      )
    ) {
      upper.pop();
    }

    upper.push(point);
  }

  lower.pop();
  upper.pop();

  return [...lower, ...upper];
};

const buildConvexGeometry = (points: Point[]): BoxGeometry => {
  const convexPoints = getConvexPoints(points);
  const center = {
    x:
      convexPoints.reduce((sum, point) => sum + point.x, 0) /
      convexPoints.length,
    y:
      convexPoints.reduce((sum, point) => sum + point.y, 0) /
      convexPoints.length,
  };
  const edges: EdgeWithNormal[] = convexPoints.map((point1, index, array) => {
    const point2 = array[(index + 1) % array.length];
    const normal = VectorOps.getNormal(point1.x, point2.x, point1.y, point2.y);
    const offset = VectorOps.dotProduct(point1, normal);

    if (VectorOps.dotProduct(center, normal) - offset > 0) {
      normal.multiplyNumber(-1);
    }

    return { point1, point2, normal };
  });

  return { center, points: convexPoints, edges };
};

export const correctContactPoint = (
  queryProxy: QueryProxy,
  hit: RaycastCheckerHit | false,
): void => {
  if (!hit) {
    return;
  }

  const { center, direction, halfExtents } =
    queryProxy.geometry as BoxCastGeometry;
  const { normal, distance } = hit;

  const centerX = center.x + direction.x * distance;
  const centerY = center.y + direction.y * distance;

  hit.point.x = centerX - Math.sign(normalizeValue(normal.x)) * halfExtents.x;
  hit.point.y = centerY - Math.sign(normalizeValue(normal.y)) * halfExtents.y;
};

export const checkBoxCastAndConvexPoints = (
  queryProxy: QueryProxy,
  points: Point[],
): ShapeCastCheckerHit | false => {
  const { halfExtents } = queryProxy.geometry as BoxCastGeometry;

  const expandedPoints: Point[] = [];

  for (const point of points) {
    for (const [signX, signY] of BOX_CORNER_SIGNS) {
      expandedPoints.push({
        x: point.x + halfExtents.x * signX,
        y: point.y + halfExtents.y * signY,
      });
    }
  }

  const convexProxy: QueryProxy = {
    aabb: queryProxy.aabb,
    geometry: buildConvexGeometry(expandedPoints),
    layer: queryProxy.layer,
  };

  return raycastCheckers.ray.box(queryProxy, convexProxy);
};

export const checkBoxCastAndCircleGeometry = (
  queryProxy: QueryProxy,
  center: Point,
  radius: number,
): ShapeCastCheckerHit | false => {
  const halfExtents = (queryProxy.geometry as BoxCastGeometry).halfExtents;

  const horizontalBox = buildConvexGeometry(
    BOX_CORNER_SIGNS.map(([signX, signY]) => ({
      x: center.x + (halfExtents.x + radius) * signX,
      y: center.y + halfExtents.y * signY,
    })),
  );
  const verticalBox = buildConvexGeometry(
    BOX_CORNER_SIGNS.map(([signX, signY]) => ({
      x: center.x + halfExtents.x * signX,
      y: center.y + (halfExtents.y + radius) * signY,
    })),
  );

  let nearest = raycastCheckers.ray.box(queryProxy, {
    aabb: queryProxy.aabb,
    geometry: horizontalBox,
    layer: queryProxy.layer,
  });

  nearest = chooseNearestIntersection(
    nearest,
    raycastCheckers.ray.box(queryProxy, {
      aabb: queryProxy.aabb,
      geometry: verticalBox,
      layer: queryProxy.layer,
    }),
  );

  const cornerCircle = {
    center: { x: 0, y: 0 },
    radius,
  };
  const cornerCircleProxy: QueryProxy = {
    aabb: queryProxy.aabb,
    geometry: cornerCircle,
    layer: queryProxy.layer,
  };

  for (const [signX, signY] of BOX_CORNER_SIGNS) {
    cornerCircle.center.x = center.x + signX * halfExtents.x;
    cornerCircle.center.y = center.y + signY * halfExtents.y;

    nearest = chooseNearestIntersection(
      nearest,
      raycastCheckers.ray.circle(queryProxy, cornerCircleProxy),
    );
  }

  return nearest;
};

export const checkBoxCastAndCapsuleGeometry = (
  queryProxy: QueryProxy,
  capsule: CapsuleGeometry,
): ShapeCastCheckerHit | false => {
  const box = queryProxy.geometry as BoxCastGeometry;
  const { halfExtents } = box;
  let nearest = checkBoxCastAndConvexPoints(queryProxy, [
    capsule.point1,
    capsule.point2,
  ]);

  nearest = chooseNearestIntersection(
    nearest,
    checkBoxCastAndCircleGeometry(queryProxy, capsule.point1, capsule.radius),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkBoxCastAndCircleGeometry(queryProxy, capsule.point2, capsule.radius),
  );

  const expandedPoints: Point[] = [];

  for (const [signX, signY] of BOX_CORNER_SIGNS) {
    expandedPoints.push(
      {
        x: capsule.point1.x + halfExtents.x * signX,
        y: capsule.point1.y + halfExtents.y * signY,
      },
      {
        x: capsule.point2.x + halfExtents.x * signX,
        y: capsule.point2.y + halfExtents.y * signY,
      },
    );
  }

  const expandedCapsule = buildConvexGeometry(expandedPoints);

  const edgeCapsule: CapsuleGeometry = {
    center: { x: 0, y: 0 },
    point1: capsule.point1,
    point2: capsule.point2,
    normal: capsule.normal,
    radius: capsule.radius,
  };
  const edgeCapsuleProxy: QueryProxy = {
    aabb: queryProxy.aabb,
    geometry: edgeCapsule,
    layer: queryProxy.layer,
  };

  for (const edge of expandedCapsule.edges) {
    edgeCapsule.center.x = (edge.point1.x + edge.point2.x) / 2;
    edgeCapsule.center.y = (edge.point1.y + edge.point2.y) / 2;
    edgeCapsule.point1 = edge.point1;
    edgeCapsule.point2 = edge.point2;
    edgeCapsule.normal = edge.normal;

    nearest = chooseNearestIntersection(
      nearest,
      raycastCheckers.ray.capsule(queryProxy, edgeCapsuleProxy),
    );
  }

  return nearest;
};
