import { Collider, Transform } from '../../../../../../components';

import { buildCircleGeometry } from '../build-circle-geometry';

describe('PhysicsSystem -> collision-detection -> buildCircleGeometry()', () => {
  it('Rotates collider offset with actor transform', () => {
    const geometry = buildCircleGeometry(
      new Collider({
        type: 'circle',
        offset: { x: 2, y: 0 },
        radius: 1,
        layer: 'default',
        disabled: false,
      }),
      new Transform({
        offset: { x: 10, y: 20 },
        rotation: 90,
        scale: { x: 1, y: 1 },
      }),
    );

    expect(geometry.center.x).toBeCloseTo(10);
    expect(geometry.center.y).toBeCloseTo(22);
  });
});
