import type { BoxCastGeometry } from '../types';
import type { BoxCastParams } from '../../../types';
import { buildBoxGeometry } from './build-box-geometry';

export function buildBoxCastGeometry(
  shapeCast: BoxCastParams,
): BoxCastGeometry {
  const box = buildBoxGeometry(shapeCast);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const point of box.points) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }

  return {
    ...box,
    origin: box.center,
    direction: shapeCast.direction.normalize(),
    maxDistance: shapeCast.maxDistance,
    halfExtents: {
      x: (maxX - minX) / 2,
      y: (maxY - minY) / 2,
    },
  };
}
