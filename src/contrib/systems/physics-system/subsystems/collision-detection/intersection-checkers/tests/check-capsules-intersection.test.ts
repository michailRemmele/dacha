import { checkCapsulesIntersection } from '../capsule-capsule/check-capsules-intersection';
import {
  createCapsuleGeometry,
  createProxy,
  expectIntersection,
  expectToBeClose,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> checkCapsulesIntersection()', () => {
  it('Returns false when capsules are separated', () => {
    const capsule1 = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));
    const capsule2 = createProxy(createCapsuleGeometry(-2, 3, 2, 3, 1));

    expect(checkCapsulesIntersection(capsule1, capsule2)).toBe(false);
  });

  it('Checks two capsules using closest points between their axis segments', () => {
    const capsule1 = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));
    const capsule2 = createProxy(createCapsuleGeometry(0, 1.5, 4, 1.5, 1));
    const intersection = expectIntersection(
      checkCapsulesIntersection(capsule1, capsule2),
    );

    expectToBeClose(intersection.normal, 0, 1);
    expect(intersection.penetration).toBeCloseTo(0.5);
    expectToBeClose(intersection.contactPoints[0], 2, 0.5);
  });

  it('Checks capsule cap overlap', () => {
    const capsule1 = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));
    const capsule2 = createProxy(createCapsuleGeometry(3.5, 0, 5.5, 0, 1));
    const intersection = expectIntersection(
      checkCapsulesIntersection(capsule1, capsule2),
    );

    expectToBeClose(intersection.normal, 1, 0);
    expect(intersection.penetration).toBeCloseTo(0.5);
    expectToBeClose(intersection.contactPoints[0], 2.5, 0);
  });
});
