import type { BoxGeometry, SegmentGeometry, Intersection } from '../../types';
import {
  buildBoxSegmentContactPoints,
  findMinBoxSegmentOverlap,
} from './utils';
import { orientNormal } from '../common/normals';
import { sortPoints } from '../common/points';

/**
 * Checks a box against a segment.
 *
 * SAT is used with the box face normals plus the segment normal to determine
 * whether the finite segment overlaps the convex box. Contact points are then
 * collected from segment endpoints inside the box, box vertices lying on the
 * segment, and explicit edge/segment intersections.
 */
export const checkBoxAndSegmentIntersection = (
  box: BoxGeometry,
  segment: SegmentGeometry,
): Intersection | false => {
  const overlap = findMinBoxSegmentOverlap(box, segment);

  if (overlap === false) {
    return false;
  }

  const contactPoints = buildBoxSegmentContactPoints(box, segment);

  if (contactPoints.length === 0) {
    return false;
  }

  const normal = orientNormal(overlap.axis.clone(), box.center, segment.center);

  return {
    normal,
    penetration: overlap.overlap,
    contactPoints: sortPoints(contactPoints, normal),
  };
};
