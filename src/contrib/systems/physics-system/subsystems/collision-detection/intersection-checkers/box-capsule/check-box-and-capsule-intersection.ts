import type {
  BoxGeometry,
  CapsuleGeometry,
  Intersection,
  Proxy,
} from '../../types';
import { orientNormal } from '../common/normals';
import { buildBoxCapsuleIntersection } from './utils';

/**
 * Checks a box against a capsule.
 *
 * A capsule is treated as a line segment swept by a radius. The fast rejection
 * path finds the closest distance between each box edge and the capsule axis;
 * if that distance is greater than the capsule radius, the shapes are
 * separated.
 *
 * When the capsule axis is already inside the box, SAT is used with
 * the box face normals plus the capsule axis normal, with the capsule
 * projection expanded by its radius.
 *
 * For deep axis overlaps, the capsule axis
 * is clipped by the box and then shifted by the capsule radius along the
 * collision normal so contacts lie on the capsule surface.
 *
 * Side and corner contacts use the nearest box point.
 */
export const checkBoxAndCapsuleIntersection = (
  arg1: Proxy,
  arg2: Proxy,
): Intersection | false => {
  const box = arg1.geometry as BoxGeometry;
  const capsule = arg2.geometry as CapsuleGeometry;
  const intersection = buildBoxCapsuleIntersection(box, capsule);

  if (!intersection) {
    return false;
  }

  return {
    ...intersection,
    normal: orientNormal(intersection.normal, box.center, capsule.center),
  };
};
