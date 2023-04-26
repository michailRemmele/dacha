import { MathOps, Vector2 } from '../../../../engine/mathLib';

import IntersectionChecker from './intersectionChecker';

class BoxAndCircleIntersectionChecker extends IntersectionChecker {
  /*
   * Checks box and circle colliders at the intersection.
   * Steps of the alghorith:
   * 1. Determine is the circle center lies inside of the box or not.
   *  This affect on the way of finding nearest point.
   * 2. Get the nearest point on the box edges to circle center.
   *  Inside box: Need to find the closest box's edge to circle center.
   *    Then we can project circle center point to this edge. This will be the nearest point.
   *  Outside box: Just use clamp function for circle center coordinates to get the nearest point.
   * 3. Get distance between circle center and
   *  the neareset point and calculate the axis using these points.
   * 4. Last step depends on the case:
   *  Inside box: Calculate mtvs for both objects.
   *  Outside box: Compare distance with circle radius.
   *    If it's large or equal - there is no intersection.
   *    If the distance is zero then circle center lies on one of the box edges
   *      so as an axis we can use perpendicular axis to this edge.
   *    In case if the circle center lies on one of the box corners, we can use
   *      circle center and box center point to get the axis.
   *    Finally we can find mtvs for both objects.
   */
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

    const { x: xArg1, y: yArg1 } = arg1.coordinates.center;
    const { x: xArg2, y: yArg2 } = arg2.coordinates.center;

    const { radius: circleRadius } = circle.collider;
    const { x: circleX, y: circleY } = circle.coordinates.center;
    const { sizeX: boxSizeX, sizeY: boxSizeY } = box.collider;
    const { x: boxX, y: boxY } = box.coordinates.center;

    const boxMinX = boxX - (boxSizeX / 2);
    const boxMaxX = boxX + (boxSizeX / 2);
    const boxMinY = boxY - (boxSizeY / 2);
    const boxMaxY = boxY + (boxSizeY / 2);

    const getMtvs = (axis, overlap) => {
      axis.multiplyNumber((1 / axis.magnitude) * overlap);

      const positiveX = Math.abs(axis.x);
      const negativeX = -Math.abs(axis.x);
      const positiveY = Math.abs(axis.y);
      const negativeY = -Math.abs(axis.y);

      return {
        mtv1: new Vector2(
          xArg1 < xArg2 ? negativeX : positiveX,
          yArg1 < yArg2 ? negativeY : positiveY,
        ),
        mtv2: new Vector2(
          xArg2 > xArg1 ? positiveX : negativeX,
          yArg2 > yArg1 ? positiveY : negativeY,
        ),
      };
    };

    let nearestBoxX;
    let nearestBoxY;
    if (circleX > boxMinX && circleX < boxMaxX && circleY > boxMinY && circleY < boxMaxY) {
      const distanceToMinX = Math.abs(circleX - boxMinX);
      const distanceToMaxX = Math.abs(circleX - boxMaxX);
      const minDistanceX = Math.min(distanceToMinX, distanceToMaxX);

      const distanceToMinY = Math.abs(circleY - boxMinY);
      const distanceToMaxY = Math.abs(circleY - boxMaxY);
      const minDistanceY = Math.min(distanceToMinY, distanceToMaxY);

      nearestBoxX = distanceToMinX < distanceToMaxX
        ? boxMinX
        : boxMaxX;
      nearestBoxY = distanceToMinY < distanceToMaxY
        ? boxMinY
        : boxMaxY;

      if (minDistanceX < minDistanceY) {
        nearestBoxY = circleY;
      } else {
        nearestBoxX = circleX;
      }

      const distance = MathOps.getDistanceBetweenTwoPoints(
        circleX,
        nearestBoxX,
        circleY,
        nearestBoxY,
      );
      const axis = new Vector2(nearestBoxX - circleX, nearestBoxY - circleY);

      return getMtvs(axis, circleRadius + distance);
    }

    nearestBoxX = MathOps.clamp(circleX, boxMinX, boxMaxX);
    nearestBoxY = MathOps.clamp(circleY, boxMinY, boxMaxY);

    const distance = MathOps.getDistanceBetweenTwoPoints(
      circleX,
      nearestBoxX,
      circleY,
      nearestBoxY,
    );

    if (distance >= circleRadius) {
      return false;
    }

    const axis = distance !== 0
      ? new Vector2(nearestBoxX - circleX, nearestBoxY - circleY)
      : new Vector2(
        circleX === boxMinX || circleX === boxMaxX ? boxX - circleX : 0,
        circleY === boxMinY || circleY === boxMaxY ? boxY - circleY : 0,
      );

    return getMtvs(axis, circleRadius - distance);
  }
}

export default BoxAndCircleIntersectionChecker;
