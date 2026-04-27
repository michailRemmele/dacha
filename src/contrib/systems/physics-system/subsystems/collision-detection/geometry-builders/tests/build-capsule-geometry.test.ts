import { Collider, Transform } from '../../../../../../components';
import { buildCapsuleGeometry } from '../build-capsule-geometry';

describe('Contrib -> systems -> PhysicsSystem -> collision-detection -> geometry-builders -> buildCapsuleGeometry', () => {
  it('Builds transformed capsule axis and scaled radius', () => {
    const geometry = buildCapsuleGeometry(
      new Collider({
        type: 'capsule',
        offset: { x: 1, y: 2 },
        point1: { x: -1, y: 0 },
        point2: { x: 1, y: 0 },
        radius: 0.5,
        layer: 'default',
      }),
      new Transform({
        offsetX: 10,
        offsetY: 20,
        rotation: 90,
        scaleX: 2,
        scaleY: 3,
      }),
    );

    expect(geometry.point1.x).toBeCloseTo(11);
    expect(geometry.point1.y).toBeCloseTo(20);
    expect(geometry.point2.x).toBeCloseTo(11);
    expect(geometry.point2.y).toBeCloseTo(24);
    expect(geometry.radius).toBeCloseTo(1.5);
  });
});
