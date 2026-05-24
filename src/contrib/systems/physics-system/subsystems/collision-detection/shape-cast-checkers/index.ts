import type { ShapeCastCheckerFn } from './types';
import { checkCircleCastAndBox } from './circle-box/check-circle-cast-and-box';
import { checkCircleCastAndCapsule } from './circle-capsule/check-circle-cast-and-capsule';
import { checkCircleCastAndCircle } from './circle-circle/check-circle-cast-and-circle';
import { checkCircleCastAndSegment } from './circle-segment/check-circle-cast-and-segment';

export const shapeCastCheckers: Record<
  string,
  Record<string, ShapeCastCheckerFn>
> = {
  circleCast: {
    box: checkCircleCastAndBox,
    capsule: checkCircleCastAndCapsule,
    circle: checkCircleCastAndCircle,
    segment: checkCircleCastAndSegment,
  },
};
