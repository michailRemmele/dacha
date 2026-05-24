import type { Proxy, QueryProxy } from '../types';
import type { CastHit } from '../../../types';

export type ShapeCastCheckerHit = Omit<CastHit, 'actor'>;

export type ShapeCastCheckerFn = (
  queryProxy: QueryProxy,
  targetProxy: Proxy,
) => ShapeCastCheckerHit | false;
