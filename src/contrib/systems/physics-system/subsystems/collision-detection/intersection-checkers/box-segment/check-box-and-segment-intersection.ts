import type {
  BoxGeometry,
  Proxy,
  SegmentGeometry,
  Intersection,
} from '../../types';
import { buildBoxSegmentContactPoints, findMinBoxSegmentOverlap } from './utils';
import { orientNormal } from '../common/normals';

/**
 * Checks a box against a segment.
 *
 * SAT is used with the box face normals plus the segment normal to determine
 * whether the finite segment overlaps the convex box. Contact points are then
 * collected from segment endpoints inside the box, box vertices lying on the
 * segment, and explicit edge/segment intersections.
 */
export const checkBoxAndSegmentIntersection = (
  arg1: Proxy,
  arg2: Proxy,
): Intersection | false => {
  const box = arg1.geometry as BoxGeometry;
  const segment = arg2.geometry as SegmentGeometry;
  const overlap = findMinBoxSegmentOverlap(box, segment);

  if (overlap === false) {
    return false;
  }

  const contactPoints = buildBoxSegmentContactPoints(box, segment);

  if (contactPoints.length === 0) {
    return false;
  }

  return {
    normal: orientNormal(
      overlap.axis.clone(),
      box.center,
      segment.center,
    ),
    penetration: overlap.overlap,
    contactPoints,
  };
};
