import type {
  BoxGeometry,
  CapsuleGeometry,
  CircleCastGeometry,
} from '../../types';
import { intersectionCheckers } from '../../intersection-checkers';
import { raycastCheckers } from '../../raycast-checkers';
import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import type { ShapeCastCheckerFn } from '../types';
import type { RaycastCheckerHit } from '../../raycast-checkers/types';
import { buildInitialOverlapHit } from '../utils';

export const checkCircleCastAndBox: ShapeCastCheckerFn = (query, target) => {
  const circle = query as CircleCastGeometry;
  const box = target as BoxGeometry;
  const overlapIntersection = intersectionCheckers.circle.box(circle, box);

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  let nearest: RaycastCheckerHit | false = false;

  for (const edge of box.edges) {
    const capsule: CapsuleGeometry = {
      center: {
        x: (edge.point1.x + edge.point2.x) / 2,
        y: (edge.point1.y + edge.point2.y) / 2,
      },
      point1: edge.point1,
      point2: edge.point2,
      normal: edge.normal,
      radius: circle.radius,
    };

    nearest = chooseNearestIntersection(
      nearest,
      raycastCheckers.ray.capsule(circle, capsule),
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
