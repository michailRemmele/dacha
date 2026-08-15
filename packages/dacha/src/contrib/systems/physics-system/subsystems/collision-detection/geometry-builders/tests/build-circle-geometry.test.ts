import { Collider, Transform } from '../../../../../../components';

import { buildCircleGeometry } from '../build-circle-geometry';

describe('PhysicsSystem -> collision-detection -> buildCircleGeometry()', () => {
  it('Rotates collider offset with actor transform', () => {
    const geometry = buildCircleGeometry(
      new Collider({
        type: 'circle',
        offsetX: 2,
        offsetY: 0,
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
