import { Collider, Transform } from '../../../../../../components';

import { buildSegmentGeometry } from '../build-segment-geometry';

describe('PhysicsSystem -> collision-detection -> buildSegmentGeometry()', () => {
  it('Rotates collider offset with actor transform', () => {
    const geometry = buildSegmentGeometry(
      new Collider({
        type: 'segment',
        offset: { x: 2, y: 0 },
        point1: { x: 0, y: 0 },
        point2: { x: 0, y: 2 },
        layer: 'default',
        disabled: false,
      }),
      new Transform({
        offset: { x: 10, y: 20 },
        rotation: 90,
        scale: { x: 1, y: 1 },
      }),
    );

    expect(geometry.point1.x).toBeCloseTo(10);
    expect(geometry.point1.y).toBeCloseTo(22);
    expect(geometry.point2.x).toBeCloseTo(8);
    expect(geometry.point2.y).toBeCloseTo(22);
  });
});
