import { chooseNearestIntersection } from '../intersection-checkers/common/cast';
import { raycastCheckers } from '../raycast-checkers';
import type { RaycastCheckerHit } from '../raycast-checkers/types';
import { BOX_CORNER_SIGNS } from './common/constants';
import { AxisAlignedBoxWorkspace } from './common/axis-aligned-box-workspace';
import { ConvexHullWorkspace } from './common/convex-hull-workspace';
import type { BoxCastGeometry, Point } from '../types';

import { normalizeValue } from './utils';
import type { ShapeCastCheckerHit } from './types';

const convexHullWorkspace = new ConvexHullWorkspace(16);
const axisAlignedBoxWorkspace = new AxisAlignedBoxWorkspace();

export const correctContactPoint = (
  box: BoxCastGeometry,
  hit: RaycastCheckerHit | false,
): void => {
  if (!hit) {
    return;
  }

  const { center, direction, halfExtents } = box;
  const { normal, distance } = hit;

  const centerX = center.x + direction.x * distance;
  const centerY = center.y + direction.y * distance;

  hit.point.x = centerX - Math.sign(normalizeValue(normal.x)) * halfExtents.x;
  hit.point.y = centerY - Math.sign(normalizeValue(normal.y)) * halfExtents.y;
};

export const checkBoxCastAndConvexPoints = (
  box: BoxCastGeometry,
  points: Point[],
): ShapeCastCheckerHit | false => {
  const { halfExtents } = box;

  convexHullWorkspace.start();
  for (const point of points) {
    convexHullWorkspace.addExpandedPoint(point, halfExtents);
  }

  return raycastCheckers.ray.box(box, convexHullWorkspace.buildGeometry());
};

export const checkBoxCastAndConvexPointPair = (
  box: BoxCastGeometry,
  point1: Point,
  point2: Point,
): ShapeCastCheckerHit | false => {
  const { halfExtents } = box;

  convexHullWorkspace.start();
  convexHullWorkspace.addExpandedPoint(point1, halfExtents);
  convexHullWorkspace.addExpandedPoint(point2, halfExtents);

  return raycastCheckers.ray.box(box, convexHullWorkspace.buildGeometry());
};

const CORNER_CIRCLE = {
  center: { x: 0, y: 0 },
  radius: 0,
};

export const checkBoxCastAndCircleGeometry = (
  box: BoxCastGeometry,
  center: Point,
  radius: number,
): ShapeCastCheckerHit | false => {
  const { halfExtents } = box;

  let nearest = raycastCheckers.ray.box(
    box,
    axisAlignedBoxWorkspace.buildGeometry(
      center,
      halfExtents.x + radius,
      halfExtents.y,
    ),
  );

  nearest = chooseNearestIntersection(
    nearest,
    raycastCheckers.ray.box(
      box,
      axisAlignedBoxWorkspace.buildGeometry(
        center,
        halfExtents.x,
        halfExtents.y + radius,
      ),
    ),
  );

  CORNER_CIRCLE.radius = radius;

  for (const [signX, signY] of BOX_CORNER_SIGNS) {
    CORNER_CIRCLE.center.x = center.x + signX * halfExtents.x;
    CORNER_CIRCLE.center.y = center.y + signY * halfExtents.y;

    nearest = chooseNearestIntersection(
      nearest,
      raycastCheckers.ray.circle(box, CORNER_CIRCLE),
    );
  }

  return nearest;
};
