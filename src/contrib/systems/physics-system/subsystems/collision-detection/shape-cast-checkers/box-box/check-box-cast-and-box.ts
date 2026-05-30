import { intersectionCheckers } from '../../intersection-checkers';
import type { BoxGeometry } from '../../types';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';
import { checkBoxCastAndConvexPoints, correctContactPoint } from '../box-utils';

export const checkBoxCastAndBox: ShapeCastCheckerFn = (
  queryProxy,
  targetProxy,
) => {
  const overlapIntersection = intersectionCheckers.box.box(
    queryProxy,
    targetProxy,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const hit = checkBoxCastAndConvexPoints(
    queryProxy,
    (targetProxy.geometry as BoxGeometry).points,
  );

  correctContactPoint(queryProxy, hit);

  return hit;
};
