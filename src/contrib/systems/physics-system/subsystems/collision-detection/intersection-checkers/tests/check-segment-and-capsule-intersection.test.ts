import { checkSegmentAndCapsuleIntersection } from '../segment-capsule/check-segment-and-capsule-intersection';
import {
  createCapsuleGeometry,
  createProxy,
  createSegmentGeometry,
  expectIntersection,
  expectToBeClose,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> checkSegmentAndCapsuleIntersection()', () => {
  it('Returns false when a segment misses a capsule', () => {
    const segment = createProxy(createSegmentGeometry(0, 2.5, 0, 4));
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));

    expect(checkSegmentAndCapsuleIntersection(segment, capsule)).toBe(false);
  });

  it('Checks a segment against a capsule side', () => {
    const segment = createProxy(createSegmentGeometry(0, 0.5, 0, 2));
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));
    const intersection = expectIntersection(
      checkSegmentAndCapsuleIntersection(segment, capsule),
    );

    expectToBeClose(intersection.normal, 0, -1);
    expect(intersection.penetration).toBeCloseTo(0.5);
    expectToBeClose(intersection.contactPoints[0], 0, 1);
  });

  it('Returns zero penetration when a segment is tangent to a capsule cap', () => {
    const segment = createProxy(createSegmentGeometry(3, -1, 3, 1));
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));
    const intersection = expectIntersection(
      checkSegmentAndCapsuleIntersection(segment, capsule),
    );

    expectToBeClose(intersection.normal, -1, 0);
    expect(intersection.penetration).toBeCloseTo(0);
    expectToBeClose(intersection.contactPoints[0], 3, 0);
  });

  it('Uses a fallback normal when a segment crosses the capsule axis', () => {
    const segment = createProxy(createSegmentGeometry(0, -1, 0, 1));
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));
    const intersection = expectIntersection(
      checkSegmentAndCapsuleIntersection(segment, capsule),
    );

    expect(intersection.normal.magnitude).toBeCloseTo(1);
    expect(intersection.penetration).toBeCloseTo(1);
    expect(intersection.contactPoints[0].x).toBeCloseTo(0);
    expect(Math.abs(intersection.contactPoints[0].y)).toBeCloseTo(1);
  });
});
