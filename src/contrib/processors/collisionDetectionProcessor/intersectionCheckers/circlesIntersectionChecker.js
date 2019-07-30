import IntersectionChecker from './intersectionChecker';

class CirclesIntersectionChecker extends IntersectionChecker {
  check(arg1, arg2) {
    const { radius: rArg1 } = arg1.collider;
    const { radius: rArg2 } = arg2.collider;
    const { x: xArg1, y: yArg1 } = arg1.coordinates.center;
    const { x: xArg2, y: yArg2 } = arg2.coordinates.center;

    const distance = Math.sqrt(Math.pow(xArg1 - xArg2, 2) + Math.pow(yArg1 - yArg2, 2));

    return distance < rArg1 + rArg2;
  }
}

export default CirclesIntersectionChecker;
