import CoordinatesCalculator from './coordinatesCalculator';

class BoxCoordinatesCalculator extends CoordinatesCalculator {
  calc(collider, transform) {
    const { offsetX, offsetY } = transform;
    const { centerX, centerY, sizeX, sizeY } = collider;

    const x1 = -(sizeX / 2) + centerX + offsetX;
    const x2 = (sizeX / 2) + centerX + offsetX;
    const y1 = -(sizeY / 2) + centerY + offsetY;
    const y2 = (sizeY / 2) + centerY + offsetY;

    return [
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
  }
}

export default BoxCoordinatesCalculator;
