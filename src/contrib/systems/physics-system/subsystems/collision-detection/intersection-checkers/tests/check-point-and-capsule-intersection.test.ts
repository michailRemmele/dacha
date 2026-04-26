import { checkPointAndCapsuleIntersection } from '../point-capsule/check-point-and-capsule-intersection';
import {
  createCapsuleGeometry,
  createPointGeometry,
  createProxy,
  expectIntersection,
  expectToBeClose,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> checkPointAndCapsuleIntersection()', () => {
  it('Returns false when a point is outside a capsule', () => {
    const point = createProxy(createPointGeometry(0, 2));
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));

    expect(checkPointAndCapsuleIntersection(point, capsule)).toBe(false);
  });

  it('Returns point contact when a point is inside a capsule side', () => {
    const point = createProxy(createPointGeometry(0, 0.5));
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));
    const intersection = expectIntersection(
      checkPointAndCapsuleIntersection(point, capsule),
    );

    expectToBeClose(intersection.normal, 0, -1);
    expect(intersection.penetration).toBeCloseTo(0.5);
    expectToBeClose(intersection.contactPoints[0], 0, 0.5);
  });

  it('Returns zero penetration when a point touches a capsule cap', () => {
    const point = createProxy(createPointGeometry(3, 0));
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));
    const intersection = expectIntersection(
      checkPointAndCapsuleIntersection(point, capsule),
    );

    expectToBeClose(intersection.normal, -1, 0);
    expect(intersection.penetration).toBeCloseTo(0);
    expectToBeClose(intersection.contactPoints[0], 3, 0);
  });
});
