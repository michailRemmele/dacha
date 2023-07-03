import type {
  ColliderContainer,
  Transform,
} from '../../../../../components';
import type { Coordinates } from '../types';

import type { CoordinatesCalculator } from './coordinates-calculator';

export class CircleCoordinatesCalculator implements CoordinatesCalculator {
  calc(container: ColliderContainer, transform: Transform): Coordinates {
    const { offsetX, offsetY } = transform;
    const { centerX, centerY } = container.collider;

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
