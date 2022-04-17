import CoordinatesCalculator from './coordinatesCalculator';

class CircleCoordinatesCalculator extends CoordinatesCalculator {
  calc(collider, transform) {
    const { offsetX, offsetY } = transform;
    const { centerX, centerY } = collider;

    return {
      center: {
        x: centerX + offsetX,
        y: centerY + offsetY,
      },
      points: [],
      edges: [],
    };
  }
}

export default CircleCoordinatesCalculator;
