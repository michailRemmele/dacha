import { Actor } from '../../../../../../../engine/actor';
import { Collider, Transform } from '../../../../../../components';
import { Vector2 } from '../../../../../../../engine/math-lib';

import { buildBoxCastGeometry } from '../build-box-cast-geometry';
import { buildCapsuleCastGeometry } from '../build-capsule-cast-geometry';
import { buildCircleCastGeometry } from '../build-circle-cast-geometry';

describe('PhysicsSystem -> collision-detection -> cast geometry builders', () => {
  const cast = {
    actor: new Actor({ id: 'actor', name: 'actor' }),
    direction: new Vector2(3, 4),
    maxDistance: 10,
  };

  it('Builds box cast geometry from collider and transform', () => {
    const collider = new Collider({
      type: 'box',
      offsetX: 1,
      offsetY: 2,
      sizeX: 4,
      sizeY: 6,
      layer: 'default',
      disabled: false,
    });
    const transform = new Transform({
      offsetX: 10,
      offsetY: 20,
      rotation: 0,
      scaleX: 2,
      scaleY: 3,
    });

    const geometry = buildBoxCastGeometry(collider, transform, cast);

    expect(geometry.origin).toEqual({ x: 12, y: 26 });
    expect(geometry.halfExtents).toEqual({ x: 4, y: 9 });
    expect(geometry.direction.x).toBeCloseTo(0.6);
    expect(geometry.direction.y).toBeCloseTo(0.8);
    expect(geometry.maxDistance).toBe(10);
  });

  it('Builds rotated box cast geometry from shape cast params', () => {
    const geometry = buildBoxCastGeometry({
      shape: {
        type: 'box',
        center: { x: 0, y: 0 },
        size: { x: 2, y: 4 },
        rotation: Math.PI / 2,
      },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });

    expect(geometry.origin).toEqual({ x: 0, y: 0 });
    expect(geometry.halfExtents.x).toBeCloseTo(2);
    expect(geometry.halfExtents.y).toBeCloseTo(1);
  });

  it('Builds circle cast geometry from collider and transform', () => {
    const collider = new Collider({
      type: 'circle',
      offsetX: -2,
      offsetY: 5,
      radius: 3,
      layer: 'default',
      disabled: false,
    });
    const transform = new Transform({
      offsetX: 10,
      offsetY: 20,
      rotation: 0,
      scaleX: 2,
      scaleY: 3,
    });

    const geometry = buildCircleCastGeometry(collider, transform, cast);

    expect(geometry.origin).toEqual({ x: 6, y: 35 });
    expect(geometry.radius).toBe(9);
    expect(geometry.direction.x).toBeCloseTo(0.6);
    expect(geometry.direction.y).toBeCloseTo(0.8);
    expect(geometry.maxDistance).toBe(10);
  });

  it('Builds capsule cast geometry from collider and transform', () => {
    const collider = new Collider({
      type: 'capsule',
      offsetX: 1,
      offsetY: 2,
      height: 4,
      radius: 2,
      layer: 'default',
      disabled: false,
    });
    const transform = new Transform({
      offsetX: 10,
      offsetY: 20,
      rotation: 0,
      scaleX: 2,
      scaleY: 3,
    });

    const geometry = buildCapsuleCastGeometry(collider, transform, cast);

    expect(geometry.origin).toEqual({ x: 12, y: 26 });
    expect(geometry.point1).toEqual({ x: 12, y: 20 });
    expect(geometry.point2).toEqual({ x: 12, y: 32 });
    expect(geometry.radius).toBe(6);
    expect(geometry.direction.x).toBeCloseTo(0.6);
    expect(geometry.direction.y).toBeCloseTo(0.8);
    expect(geometry.maxDistance).toBe(10);
    expect(geometry.cap1.maxDistance).toBe(10);
    expect(geometry.cap2.maxDistance).toBe(10);
    expect(geometry.box?.maxDistance).toBe(10);
  });

  it('Builds rotated capsule cast geometry from shape cast params', () => {
    const geometry = buildCapsuleCastGeometry({
      shape: {
        type: 'capsule',
        center: { x: 10, y: 20 },
        height: 2,
        radius: 0.5,
        rotation: Math.PI / 2,
      },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });

    expect(geometry.origin).toEqual({ x: 10, y: 20 });
    expect(geometry.point1.x).toBeCloseTo(11);
    expect(geometry.point1.y).toBeCloseTo(20);
    expect(geometry.point2.x).toBeCloseTo(9);
    expect(geometry.point2.y).toBeCloseTo(20);
  });
});
