import type { Geometry } from '../types';
import type { CastHit } from '../../../types';

export type ShapeCastCheckerHit = Omit<CastHit, 'actor'>;

export type ShapeCastCheckerFn<
  T extends Geometry = Geometry,
  U extends Geometry = Geometry,
> = (query: T, target: U) => ShapeCastCheckerHit | false;
