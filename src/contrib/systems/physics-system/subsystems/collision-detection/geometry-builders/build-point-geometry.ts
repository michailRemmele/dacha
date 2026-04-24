import type { PointGeometry } from '../types';
import type { OverlapPointParams } from '../../../types';

export function buildPointGeometry(overlap: OverlapPointParams): PointGeometry {
  return {
    center: overlap.point,
  };
}
