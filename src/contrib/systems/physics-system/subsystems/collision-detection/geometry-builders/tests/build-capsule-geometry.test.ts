import { Collider, Transform } from '../../../../../../components';
import { buildCapsuleGeometry } from '../build-capsule-geometry';

describe('Contrib -> systems -> PhysicsSystem -> collision-detection -> geometry-builders -> buildCapsuleGeometry', () => {
  it('Builds transformed capsule axis and scaled radius', () => {
    const geometry = buildCapsuleGeometry(
      new Collider({
        type: 'capsule',
        offsetX: 1,
        offsetY: 2,
        height: 2,
        radius: 0.5,
        layer: 'default',
        disabled: false,
      }),
      new Transform({
        offsetX: 10,
        offsetY: 20,
        rotation: 0,
        scaleX: 2,
        scaleY: 3,
      }),
    );

    expect(geometry.point1.x).toBeCloseTo(12);
    expect(geometry.point1.y).toBeCloseTo(23);
    expect(geometry.point2.x).toBeCloseTo(12);
    expect(geometry.point2.y).toBeCloseTo(29);
    expect(geometry.radius).toBeCloseTo(1.5);
  });

  it('Rotates collider offset with actor transform', () => {
    const geometry = buildCapsuleGeometry(
      new Collider({
        type: 'capsule',
        offsetX: 2,
        offsetY: 0,
        height: 2,
        radius: 1,
        layer: 'default',
        disabled: false,
      }),
      new Transform({
        offsetX: 10,
        offsetY: 20,
        rotation: 90,
        scaleX: 1,
        scaleY: 1,
      }),
    );

    expect(geometry.center.x).toBeCloseTo(10);
    expect(geometry.center.y).toBeCloseTo(22);
  });
});
