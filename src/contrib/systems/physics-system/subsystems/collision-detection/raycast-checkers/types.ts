import type { Proxy, QueryProxy } from '../types';
import type { CastHit } from '../../../types';

export type RaycastCheckerHit = Omit<CastHit, 'actor'>;

export type RaycastCheckerFn = (
  queryProxy: QueryProxy,
  targetProxy: Proxy,
) => RaycastCheckerHit | false;
