import { Vector2 } from 'engine/mathLib';

import IntersectionChecker from './intersectionChecker';

class CirclesIntersectionChecker extends IntersectionChecker {
  check(arg1, arg2) {
    const { radius: rArg1 } = arg1.collider;
    const { radius: rArg2 } = arg2.collider;
    const { x: xArg1, y: yArg1 } = arg1.coordinates.center;
    const { x: xArg2, y: yArg2 } = arg2.coordinates.center;

    const x = xArg1 - xArg2;
    const y = yArg1 - yArg2;
    const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    if (distance >= rArg1 + rArg2) {
      return false;
    }

    const mtv = new Vector2(x, y);
    const overlap = rArg1 + rArg2 - distance;
    mtv.multiplyNumber(1 / distance * overlap);

    const positiveX = Math.abs(mtv.x);
    const negativeX = -Math.abs(mtv.x);
    const positiveY = Math.abs(mtv.y);
    const negativeY = -Math.abs(mtv.y);

    return {
      mtv1: new Vector2(
        xArg1 < xArg2 ? negativeX : positiveX,
        yArg1 < yArg2 ? negativeY : positiveY
      ),
      mtv2: new Vector2(
        xArg2 < xArg1 ? negativeX : positiveX,
        yArg2 < yArg1 ? negativeY : positiveY
      ),
    };
  }
}

export default CirclesIntersectionChecker;
