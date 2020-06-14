import IntersectionChecker from './intersectionChecker';
import SAT from './sat';

class BoxAndCircleIntersectionChecker extends IntersectionChecker {
  constructor() {
    super();
    this.sat = new SAT();
  }

  check(arg1, arg2) {
    let box;
    let circle;
    if (arg1.coordinates.points.length) {
      box = arg1;
      circle = arg2;
    } else {
      box = arg2;
      circle = arg1;
    }

    const { radius: circleRadius } = circle.collider;
    const { x: circleCenterX, y: circleCenterY } = circle.coordinates.center;
    const { x: rectangleCenterX, y: rectangleCenterY } = box.coordinates.center;

    const distanceX = Math.abs(circleCenterX - rectangleCenterX);
    const distanceY = Math.abs(circleCenterY - rectangleCenterY);

    const boxRadiusX = box.collider.sizeX / 2;
    const boxRadiusY = box.collider.sizeY / 2;

    if (distanceX <= boxRadiusX || distanceY <= boxRadiusY) {
      return true;
    }

    const cornerDistance = Math.sqrt(
      Math.pow(distanceX - boxRadiusX, 2) +
      Math.pow(distanceY - boxRadiusY, 2)
    );

    return cornerDistance < circleRadius;
  }
}

export default BoxAndCircleIntersectionChecker;
