import type { Geometry, RayGeometry } from '../types';
import type { CastHit } from '../../../types';

export type RaycastCheckerHit = Omit<CastHit, 'actor'>;

export type RaycastCheckerFn<T extends Geometry = Geometry> = (
  ray: RayGeometry,
  target: T,
) => RaycastCheckerHit | false;
