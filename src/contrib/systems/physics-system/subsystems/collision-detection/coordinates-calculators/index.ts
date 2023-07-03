import { BoxCoordinatesCalculator } from './box-coordinates-calculator';
import { CircleCoordinatesCalculator } from './circle-coordinates-calculator';
import type { CoordinatesCalculator } from './coordinates-calculator';

export type { CoordinatesCalculator };

export const coordinatesCalculators: Record<string, { new(): CoordinatesCalculator }> = {
  boxCollider: BoxCoordinatesCalculator,
  circleCollider: CircleCoordinatesCalculator,
};
