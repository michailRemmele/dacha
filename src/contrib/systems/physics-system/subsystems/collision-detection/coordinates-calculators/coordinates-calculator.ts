import type {
  ColliderContainer,
  Transform,
} from '../../../../../components';
import type { Coordinates } from '../types';

export interface CoordinatesCalculator {
  calc(collider: ColliderContainer, transform: Transform): Coordinates
}
