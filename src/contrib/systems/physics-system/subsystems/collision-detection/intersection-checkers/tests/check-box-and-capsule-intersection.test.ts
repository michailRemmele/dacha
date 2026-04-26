import { checkBoxAndCapsuleIntersection } from '../box-capsule/check-box-and-capsule-intersection';
import {
  createBoxGeometry,
  createCapsuleGeometry,
  createProxy,
  createRotatedBoxGeometry,
  expectIntersection,
  expectToBeClose,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> checkBoxAndCapsuleIntersection()', () => {
  it('Returns false when a box and capsule are separated', () => {
    const box = createProxy(createBoxGeometry(0, 3, 2, 1));
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));

    expect(checkBoxAndCapsuleIntersection(box, capsule)).toBe(false);
  });

  it('Checks a box against a capsule side', () => {
    const box = createProxy(createBoxGeometry(0, 1.25, 2, 1));
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));
    const intersection = expectIntersection(
      checkBoxAndCapsuleIntersection(box, capsule),
    );

    expectToBeClose(intersection.normal, 0, -1);
    expect(intersection.penetration).toBeCloseTo(0.25);
    expectToBeClose(intersection.contactPoints[0], -1, 0.75);
  });

  it('Offsets clipped box/capsule axis contacts by capsule radius', () => {
    const box = createProxy(createBoxGeometry(0, 0, 2, 2));
    const capsule = createProxy(createCapsuleGeometry(-3, 0, 3, 0, 0.5));
    const intersection = expectIntersection(
      checkBoxAndCapsuleIntersection(box, capsule),
    );

    expect(intersection.contactPoints.length).toBe(2);
    expectToBeClose(intersection.contactPoints[0], -1, -0.5);
    expectToBeClose(intersection.contactPoints[1], 1, -0.5);
  });

  it('Checks a capsule against a rotated box', () => {
    const box = createProxy(createRotatedBoxGeometry(0, 0, 2, 2, Math.PI / 4));
    const capsule = createProxy(createCapsuleGeometry(0, 1.25, 0, 3, 0.5));
    const intersection = expectIntersection(
      checkBoxAndCapsuleIntersection(box, capsule),
    );

    expect(intersection.normal.magnitude).toBeCloseTo(1);
    expect(intersection.penetration).toBeGreaterThan(0);
    expect(intersection.contactPoints.length).toBeGreaterThan(0);
  });
});
