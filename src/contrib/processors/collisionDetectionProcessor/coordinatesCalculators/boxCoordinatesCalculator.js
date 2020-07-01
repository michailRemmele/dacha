import { VectorOps } from 'engine/mathLib';

import CoordinatesCalculator from './coordinatesCalculator';

class BoxCoordinatesCalculator extends CoordinatesCalculator {
  calc(collider, transform) {
    const { offsetX, offsetY } = transform;
    let { centerX, centerY } = collider;
    const { sizeX, sizeY } = collider;

    centerX += offsetX;
    centerY += offsetY;

    const x1 = -(sizeX / 2) + centerX;
    const x2 = (sizeX / 2) + centerX;
    const y1 = -(sizeY / 2) + centerY;
    const y2 = (sizeY / 2) + centerY;

    const points = [
      {
        x: x1,
        y: y1,
      },
      {
        x: x1,
        y: y2,
      },
      {
        x: x2,
        y: y2,
      },
      {
        x: x2,
        y: y1,
      },
    ];

    const edges = points.map((point1, index, array) => {
      const point2 = array[(index + 1) % array.length];

      return {
        point1,
        point2,
        normal: VectorOps.getNormal(point1.x, point2.x, point1.y, point2.y),
      };
    });

    return {
      center: {
        x: centerX,
        y: centerY,
      },
      points,
      edges,
    };
  }
}

export default BoxCoordinatesCalculator;
