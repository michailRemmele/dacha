import { chooseNearestIntersection } from '../../intersection-checkers/common/cast';
import { checkRayAndCapsuleIntersection } from '../../raycast-checkers/ray-capsule/check-ray-and-capsule-intersection';
import { raycastCheckers } from '../../raycast-checkers';
import type {
  BoxCastGeometry,
  BoxGeometry,
  CapsuleGeometry,
  Point,
} from '../../types';
import { checkBoxCastAndCircleGeometry } from '../box-utils';
import { ConvexHullWorkspace } from '../common/convex-hull-workspace';
import type { ShapeCastCheckerHit } from '../types';

const convexHullWorkspace = new ConvexHullWorkspace(8);

const buildBoxExpandedCapsuleGeometry = (
  halfExtents: Point,
  capsule: CapsuleGeometry,
): BoxGeometry => {
  convexHullWorkspace.start();
  convexHullWorkspace.addExpandedPoint(capsule.point1, halfExtents);
  convexHullWorkspace.addExpandedPoint(capsule.point2, halfExtents);

  return convexHullWorkspace.buildGeometry();
};

export const checkBoxCastAndCapsuleGeometry = (
  box: BoxCastGeometry,
  capsule: CapsuleGeometry,
): ShapeCastCheckerHit | false => {
  const { halfExtents } = box;
  const expandedCapsule = buildBoxExpandedCapsuleGeometry(halfExtents, capsule);
  let nearest = raycastCheckers.ray.box(box, expandedCapsule);

  nearest = chooseNearestIntersection(
    nearest,
    checkBoxCastAndCircleGeometry(box, capsule.point1, capsule.radius),
  );
  nearest = chooseNearestIntersection(
    nearest,
    checkBoxCastAndCircleGeometry(box, capsule.point2, capsule.radius),
  );

  for (const edge of expandedCapsule.edges) {
    nearest = chooseNearestIntersection(
      nearest,
      checkRayAndCapsuleIntersection(box, edge, capsule.radius),
    );
  }

  return nearest;
};
