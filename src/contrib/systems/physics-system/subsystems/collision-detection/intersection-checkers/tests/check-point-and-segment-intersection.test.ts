import { checkPointAndSegmentIntersection } from '../point-segment/check-point-and-segment-intersection';
import {
  createPointGeometry,
  createProxy,
  createSegmentGeometry,
  expectIntersection,
  expectToBeClose,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> checkPointAndSegmentIntersection()', () => {
  it('Returns false when the point is outside the segment', () => {
    const point = createProxy(createPointGeometry(3, 1));
    const segment = createProxy(createSegmentGeometry(-2, 0, 2, 0));

    expect(checkPointAndSegmentIntersection(point, segment)).toBe(false);
  });

  it('Returns a zero-penetration contact when the point lies on the segment', () => {
    const point = createProxy(createPointGeometry(1, 0));
    const segment = createProxy(createSegmentGeometry(-2, 0, 2, 0));

    const intersection = expectIntersection(
      checkPointAndSegmentIntersection(point, segment),
    );

    expectToBeClose(intersection.normal, 0, 1);
    expect(intersection.penetration).toBe(0);
    expect(intersection.contactPoints).toHaveLength(1);
    expectToBeClose(intersection.contactPoints[0], 1, 0);
  });

  it('Returns the endpoint when the point touches the segment endpoint', () => {
    const point = createProxy(createPointGeometry(2, 0));
    const segment = createProxy(createSegmentGeometry(-2, 0, 2, 0));

    const intersection = expectIntersection(
      checkPointAndSegmentIntersection(point, segment),
    );

    expect(intersection.penetration).toBe(0);
    expectToBeClose(intersection.contactPoints[0], 2, 0);
  });

  it('Uses the fallback normal for a degenerate segment', () => {
    const point = createProxy(createPointGeometry(1, 1));
    const segment = createProxy(createSegmentGeometry(1, 1, 1, 1));

    const intersection = expectIntersection(
      checkPointAndSegmentIntersection(point, segment),
    );

    expectToBeClose(intersection.normal, 1, 0);
    expect(intersection.penetration).toBe(0);
    expectToBeClose(intersection.contactPoints[0], 1, 1);
  });
});
