import type { Proxy, BoxGeometry, Intersection } from '../../types';
import { orientNormal } from '../utils';

import { findMinBoxesOverlap, buildContactPoints } from './utils';

/**
 * Checks box colliders for intersection.
 *
 * The SAT (separating axis theorem) is used to find the collision normal
 * and penetration depth. Once the best axis is known, the incident edge is
 * clipped against the reference edge to produce up to two stable contact
 * points for impulse-based collision resolution.
 */
export const checkBoxesIntersection = (
  arg1: Proxy,
  arg2: Proxy,
): Intersection | false => {
  const geometry1 = arg1.geometry as BoxGeometry;
  const geometry2 = arg2.geometry as BoxGeometry;

  const overlap1 = findMinBoxesOverlap(geometry1, geometry2);
  if (overlap1 === false) {
    return false;
  }

  const overlap2 = findMinBoxesOverlap(geometry2, geometry1);
  if (overlap2 === false) {
    return false;
  }

  const isArg1Reference = overlap1.overlap <= overlap2.overlap;
  const referenceGeometry = isArg1Reference ? geometry1 : geometry2;
  const incidentGeometry = isArg1Reference ? geometry2 : geometry1;
  const referenceOverlap = isArg1Reference ? overlap1 : overlap2;

  const normal = orientNormal(
    referenceOverlap.axis.clone(),
    geometry1.center,
    geometry2.center,
  );
  const referenceNormal = normal.clone();

  if (!isArg1Reference) {
    referenceNormal.multiplyNumber(-1);
  }

  return {
    normal,
    penetration: referenceOverlap.overlap,
    contactPoints: buildContactPoints(
      referenceGeometry,
      referenceNormal,
      incidentGeometry,
    ),
  };
};
