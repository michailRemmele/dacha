import { buildCapsuleAABB } from '../build-capsule-aabb';
import { createCapsuleGeometry } from '../../intersection-checkers/tests/helpers';

describe('Contrib -> systems -> PhysicsSystem -> collision-detection -> aabb-builders -> buildCapsuleAABB', () => {
  it('Expands capsule axis bounds by radius', () => {
    const aabb = buildCapsuleAABB(createCapsuleGeometry(-2, 1, 3, 4, 0.5));

    expect(aabb.min.x).toBeCloseTo(-2.5);
    expect(aabb.min.y).toBeCloseTo(0.5);
    expect(aabb.max.x).toBeCloseTo(3.5);
    expect(aabb.max.y).toBeCloseTo(4.5);
  });
});
