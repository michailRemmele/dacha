import { Collider, Transform } from '../../../../../../components';
import { VectorOps } from '../../../../../../../engine/math-lib';

import { buildBoxGeometry } from '../build-box-geometry';

describe('PhysicsSystem -> collision-detection -> buildBoxGeometry()', () => {
  it('Builds outward normals for mirrored boxes', () => {
    const collider = new Collider({
      type: 'box',
      offset: { x: 0, y: 0 },
      size: { x: 4, y: 2 },
      layer: 'default',
      disabled: true,
    });
    const transform = new Transform({
      offset: { x: 3, y: -2 },
      rotation: 30,
      scale: { x: -2, y: 1.5 },
    });
    const geometry = buildBoxGeometry(collider, transform);

    geometry.edges.forEach((edge) => {
      const offset = VectorOps.dotProduct(edge.point1, edge.normal);
      const centerDistance =
        VectorOps.dotProduct(geometry.center, edge.normal) - offset;

      expect(centerDistance).toBeLessThanOrEqual(0);
    });
  });

  it('Rotates collider offset with actor transform', () => {
    const geometry = buildBoxGeometry(
      new Collider({
        type: 'box',
        offset: { x: 2, y: 0 },
        size: { x: 2, y: 2 },
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
