import { intersectionCheckers } from '../../intersection-checkers';
import type { CircleGeometry } from '../../types';
import type { ShapeCastCheckerFn } from '../types';
import { buildInitialOverlapHit } from '../utils';
import {
  checkBoxCastAndCircleGeometry,
  correctContactPoint,
} from '../box-utils';

export const checkBoxCastAndCircle: ShapeCastCheckerFn = (
  queryProxy,
  targetProxy,
) => {
  const overlapIntersection = intersectionCheckers.box.circle(
    queryProxy,
    targetProxy,
  );

  if (overlapIntersection) {
    return buildInitialOverlapHit(overlapIntersection);
  }

  const circle = targetProxy.geometry as CircleGeometry;

  const hit = checkBoxCastAndCircleGeometry(
    queryProxy,
    circle.center,
    circle.radius,
  );

  correctContactPoint(queryProxy, hit);

  return hit;
};
