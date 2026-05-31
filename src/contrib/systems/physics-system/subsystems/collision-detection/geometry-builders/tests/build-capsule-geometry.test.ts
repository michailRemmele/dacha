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

    expect(geometry.point1.x).toBeCloseTo(11);
    expect(geometry.point1.y).toBeCloseTo(19);
    expect(geometry.point2.x).toBeCloseTo(11);
    expect(geometry.point2.y).toBeCloseTo(25);
    expect(geometry.radius).toBeCloseTo(1.5);
  });
});
