import { Collider, Transform } from '../../../../../../components';
import { VectorOps } from '../../../../../../../engine/math-lib';

import { buildBoxGeometry } from '../build-box-geometry';

describe('PhysicsSystem -> collision-detection -> buildBoxGeometry()', () => {
  it('Builds outward normals for mirrored boxes', () => {
    const collider = new Collider({
      type: 'box',
      centerX: 0,
      centerY: 0,
      sizeX: 4,
      sizeY: 2,
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
      const centerDistance = VectorOps.dotProduct(geometry.center, edge.normal) - offset;

      expect(centerDistance).toBeLessThanOrEqual(0);
    });
  });
});
