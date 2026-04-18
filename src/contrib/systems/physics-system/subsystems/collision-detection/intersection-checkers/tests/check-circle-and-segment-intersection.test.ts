import { checkCircleAndSegmentIntersection } from '../circle-segment/check-circle-and-segment-intersection';
import {
  createCircleGeometry,
  createProxy,
  createSegmentGeometry,
  expectIntersection,
  expectToBeClose,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> checkCircleAndSegmentIntersection()', () => {
  it('Returns false when a circle is separated from a segment', () => {
    const circle = createProxy(createCircleGeometry(0, 3, 1));
    const segment = createProxy(createSegmentGeometry(-2, 0, 2, 0));

    expect(checkCircleAndSegmentIntersection(circle, segment)).toBe(false);
  });

  it('Returns contact data when a circle overlaps a segment', () => {
    const circle = createProxy(createCircleGeometry(0, 0.75, 1));
    const segment = createProxy(createSegmentGeometry(-2, 0, 2, 0));

    const intersection = expectIntersection(
      checkCircleAndSegmentIntersection(circle, segment),
    );

    expectToBeClose(intersection.normal, 0, -1);
    expect(intersection.penetration).toBeCloseTo(0.25);
    expectToBeClose(intersection.contactPoints[0], 0, 0);
  });
});
