import type { Vector2 } from '../../../../../../engine/mathLib';
import type { ColliderContainer } from '../../../../../components';
import type { Coordinates } from '../types';

export interface Intersection {
  mtv1: Vector2
  mtv2: Vector2
}

export interface IntersectionEntry extends Pick<ColliderContainer, 'type' | 'collider'> {
  coordinates: Coordinates
}

export interface IntersectionChecker {
  check(arg1: IntersectionEntry, arg2: IntersectionEntry): Intersection | false
}
