import type { BoxGeometry, CircleCastGeometry, QueryProxy } from '../../types';
import { intersectionCheckers } from '../../intersection-checkers';
import { raycastCheckers } from '../../raycast-checkers';
import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import type { ShapeCastCheckerFn } from '../types';
import type { RaycastCheckerHit } from '../../raycast-checkers/types';
import { buildInitialOverlapHit } from '../utils';

export const checkCircleCastAndBox: ShapeCastCheckerFn = (
  queryProxy,
  targetProxy,
) => {
  const overlapIntersection = intersectionCheckers.circle.box(
    queryProxy,
    targetProxy,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const circle = queryProxy.geometry as CircleCastGeometry;
  const box = targetProxy.geometry as BoxGeometry;
  let nearest: RaycastCheckerHit | false = false;

  for (const edge of box.edges) {
    const capsuleProxy: QueryProxy = {
      aabb: targetProxy.aabb,
      geometry: {
        center: {
          x: (edge.point1.x + edge.point2.x) / 2,
          y: (edge.point1.y + edge.point2.y) / 2,
        },
        point1: edge.point1,
        point2: edge.point2,
        normal: edge.normal,
        radius: circle.radius,
      },
      layer: targetProxy.layer,
    };

    nearest = chooseNearestIntersection(
      nearest,
      raycastCheckers.ray.capsule(queryProxy, capsuleProxy),
    );
  }

  if (!nearest) {
    return false;
  }

  nearest.point = {
    x: nearest.point.x - nearest.normal.x * circle.radius,
    y: nearest.point.y - nearest.normal.y * circle.radius,
  };

  return nearest;
};
