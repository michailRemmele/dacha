import { Vector2 } from '../../../../../../../engine/math-lib';
import { buildBoxCastGeometry } from '../../geometry-builders/build-box-cast-geometry';
import { buildCapsuleCastGeometry } from '../../geometry-builders/build-capsule-cast-geometry';
import { buildCircleCastGeometry } from '../../geometry-builders/build-circle-cast-geometry';
import type {
  BoxCastGeometry,
  CapsuleCastGeometry,
  CircleCastGeometry,
} from '../../types';
import type { ShapeCastCheckerHit } from '../types';
import { expectHit } from '../../tests/assertions';

export const createCircleCastGeometry = (
  centerX: number,
  centerY: number,
  radius: number,
  directionX: number,
  directionY: number,
  maxDistance: number,
): CircleCastGeometry =>
  buildCircleCastGeometry({
    shape: {
      type: 'circle',
      center: { x: centerX, y: centerY },
      radius,
    },
    direction: new Vector2(directionX, directionY),
    maxDistance,
  });

export const createCapsuleCastGeometry = (
  centerX: number,
  centerY: number,
  height: number,
  radius: number,
  directionX: number,
  directionY: number,
  maxDistance: number,
): CapsuleCastGeometry =>
  buildCapsuleCastGeometry({
    shape: {
      type: 'capsule',
      center: { x: centerX, y: centerY },
      height,
      radius,
    },
    direction: new Vector2(directionX, directionY),
    maxDistance,
  });

export const createBoxCastGeometry = (
  centerX: number,
  centerY: number,
  sizeX: number,
  sizeY: number,
  directionX: number,
  directionY: number,
  maxDistance: number,
): BoxCastGeometry =>
  buildBoxCastGeometry({
    shape: {
      type: 'box',
      center: { x: centerX, y: centerY },
      size: { x: sizeX, y: sizeY },
    },
    direction: new Vector2(directionX, directionY),
    maxDistance,
  });

export const expectShapeCastHit = (
  hit: ShapeCastCheckerHit | false,
): ShapeCastCheckerHit => expectHit(hit, 'shape-cast hit');
