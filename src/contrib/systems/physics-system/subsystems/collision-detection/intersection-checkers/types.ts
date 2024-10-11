import type { Vector2 } from '../../../../../../engine/math-lib';
import type { ColliderContainer } from '../../../../../components';
import type { Geometry } from '../types';

export interface Intersection {
  mtv1: Vector2
  mtv2: Vector2
}

export interface IntersectionEntry extends Pick<ColliderContainer, 'type' | 'collider'> {
  geometry: Geometry
}
