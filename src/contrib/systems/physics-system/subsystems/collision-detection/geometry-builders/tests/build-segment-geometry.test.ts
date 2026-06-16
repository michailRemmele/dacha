import { Collider, Transform } from '../../../../../../components';

import { buildSegmentGeometry } from '../build-segment-geometry';

describe('PhysicsSystem -> collision-detection -> buildSegmentGeometry()', () => {
  it('Rotates collider offset with actor transform', () => {
    const geometry = buildSegmentGeometry(
      new Collider({
        type: 'segment',
        offsetX: 2,
        offsetY: 0,
        point1X: 0,
        point1Y: 0,
        point2X: 0,
        point2Y: 2,
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

    expect(geometry.point1.x).toBeCloseTo(10);
    expect(geometry.point1.y).toBeCloseTo(22);
    expect(geometry.point2.x).toBeCloseTo(8);
    expect(geometry.point2.y).toBeCloseTo(22);
  });
});
