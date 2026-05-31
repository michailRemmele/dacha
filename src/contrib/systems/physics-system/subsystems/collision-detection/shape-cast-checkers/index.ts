import type { ShapeCastCheckerFn } from './types';
import { checkCircleCastAndBox } from './circle-box/check-circle-cast-and-box';
import { checkCircleCastAndCapsule } from './circle-capsule/check-circle-cast-and-capsule';
import { checkCircleCastAndCircle } from './circle-circle/check-circle-cast-and-circle';
import { checkCircleCastAndSegment } from './circle-segment/check-circle-cast-and-segment';
import { checkCapsuleCastAndBox } from './capsule-box/check-capsule-cast-and-box';
import { checkCapsuleCastAndCapsule } from './capsule-capsule/check-capsule-cast-and-capsule';
import { checkCapsuleCastAndCircle } from './capsule-circle/check-capsule-cast-and-circle';
import { checkCapsuleCastAndSegment } from './capsule-segment/check-capsule-cast-and-segment';
import { checkBoxCastAndBox } from './box-box/check-box-cast-and-box';
import { checkBoxCastAndCapsule } from './box-capsule/check-box-cast-and-capsule';
import { checkBoxCastAndCircle } from './box-circle/check-box-cast-and-circle';
import { checkBoxCastAndSegment } from './box-segment/check-box-cast-and-segment';

export const shapeCastCheckers = {
  circleCast: {
    box: checkCircleCastAndBox,
    capsule: checkCircleCastAndCapsule,
    circle: checkCircleCastAndCircle,
    segment: checkCircleCastAndSegment,
  },
  capsuleCast: {
    box: checkCapsuleCastAndBox,
    capsule: checkCapsuleCastAndCapsule,
    circle: checkCapsuleCastAndCircle,
    segment: checkCapsuleCastAndSegment,
  },
  boxCast: {
    box: checkBoxCastAndBox,
    capsule: checkBoxCastAndCapsule,
    circle: checkBoxCastAndCircle,
    segment: checkBoxCastAndSegment,
  },
} as Record<string, Record<string, ShapeCastCheckerFn>>;
