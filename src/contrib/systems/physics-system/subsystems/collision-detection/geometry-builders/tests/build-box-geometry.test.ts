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
    });
    const transform = new Transform({
      offsetX: 3,
      offsetY: -2,
      rotation: 30,
      scaleX: -2,
      scaleY: 1.5,
    });
    const geometry = buildBoxGeometry(collider, transform);

    geometry.edges.forEach((edge) => {
      const offset = VectorOps.dotProduct(edge.point1, edge.normal);
      const centerDistance =
        VectorOps.dotProduct(geometry.center, edge.normal) - offset;

      expect(centerDistance).toBeLessThanOrEqual(0);
    });
  });
});
