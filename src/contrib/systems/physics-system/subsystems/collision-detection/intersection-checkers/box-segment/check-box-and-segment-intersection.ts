import type {
  BoxGeometry,
  Proxy,
  SegmentGeometry,
  Intersection,
} from '../../types';
import { buildBoxSegmentContactPoints, findMinBoxSegmentOverlap } from './utils';
import { orientNormal } from '../utils';

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
  const isBoxFirst = 'edges' in arg1.geometry;
  const box = (isBoxFirst ? arg1.geometry : arg2.geometry) as BoxGeometry;
  const segment = (isBoxFirst ? arg2.geometry : arg1.geometry) as SegmentGeometry;
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
      (arg1.geometry as BoxGeometry | SegmentGeometry).center,
      (arg2.geometry as BoxGeometry | SegmentGeometry).center,
    ),
    penetration: overlap.overlap,
    contactPoints,
  };
};
