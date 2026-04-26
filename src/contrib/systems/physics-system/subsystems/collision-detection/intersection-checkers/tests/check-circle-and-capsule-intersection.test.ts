import { checkCircleAndCapsuleIntersection } from '../circle-capsule/check-circle-and-capsule-intersection';
import {
  createCapsuleGeometry,
  createCircleGeometry,
  createProxy,
  expectIntersection,
  expectToBeClose,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> checkCircleAndCapsuleIntersection()', () => {
  it('Returns false when a circle is outside a capsule', () => {
    const circle = createProxy(createCircleGeometry(0, 2, 0.5));
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));

    expect(checkCircleAndCapsuleIntersection(circle, capsule)).toBe(false);
  });

  it('Checks a circle against the swept segment of a capsule', () => {
    const circle = createProxy(createCircleGeometry(0, 1.25, 0.5));
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));
    const intersection = expectIntersection(
      checkCircleAndCapsuleIntersection(circle, capsule),
    );

    expectToBeClose(intersection.normal, 0, -1);
    expect(intersection.penetration).toBeCloseTo(0.25);
    expectToBeClose(intersection.contactPoints[0], 0, 1);
  });

  it('Checks a circle against a capsule cap', () => {
    const circle = createProxy(createCircleGeometry(3.25, 0, 0.5));
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));
    const intersection = expectIntersection(
      checkCircleAndCapsuleIntersection(circle, capsule),
    );

    expectToBeClose(intersection.normal, -1, 0);
    expect(intersection.penetration).toBeCloseTo(0.25);
    expectToBeClose(intersection.contactPoints[0], 3, 0);
  });
});
