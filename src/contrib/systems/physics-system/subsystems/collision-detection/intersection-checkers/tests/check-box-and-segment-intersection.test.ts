import { checkBoxAndSegmentIntersection } from '../box-segment/check-box-and-segment-intersection';
import {
  createBoxGeometry,
  createProxy,
  createRotatedBoxGeometry,
  createSegmentGeometry,
  expectToBeClose,
  expectIntersection,
  sortPoints,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> checkBoxAndSegmentIntersection()', () => {
  it('Returns false when the segment misses the box', () => {
    const box = createProxy(createBoxGeometry(0, 0, 2, 2));
    const segment = createProxy(createSegmentGeometry(2, 2, 4, 4));

    expect(checkBoxAndSegmentIntersection(box, segment)).toBe(false);
  });

  it('Returns contact points when a segment crosses a box', () => {
    const box = createProxy(createBoxGeometry(0, 0, 4, 4));
    const segment = createProxy(createSegmentGeometry(-4, 0, 4, 0));

    const intersection = expectIntersection(
      checkBoxAndSegmentIntersection(box, segment),
    );

    expect(intersection.penetration).toBeGreaterThanOrEqual(0);
    expect(sortPoints(intersection.contactPoints)).toStrictEqual([
      { x: -2, y: 0 },
      { x: 2, y: 0 },
    ]);
  });

  it('Returns the clipped overlap when the segment lies on a box edge', () => {
    const box = createProxy(createBoxGeometry(0, 0, 4, 4));
    const segment = createProxy(createSegmentGeometry(-4, 2, 1, 2));

    const intersection = expectIntersection(
      checkBoxAndSegmentIntersection(box, segment),
    );

    expect(sortPoints(intersection.contactPoints)).toStrictEqual([
      { x: -2, y: 2 },
      { x: 1, y: 2 },
    ]);
  });

  it('Returns a single contact point when the segment only touches a corner', () => {
    const box = createProxy(createBoxGeometry(0, 0, 4, 4));
    const segment = createProxy(createSegmentGeometry(-4, 4, -2, 2));

    const intersection = expectIntersection(
      checkBoxAndSegmentIntersection(box, segment),
    );

    expect(intersection.contactPoints).toStrictEqual([{ x: -2, y: 2 }]);
  });

  it('Clips correctly against a rotated box', () => {
    const box = createProxy(createRotatedBoxGeometry(0, 0, 4, 4, Math.PI / 4));
    const segment = createProxy(createSegmentGeometry(-4, 0, 4, 0));

    const intersection = expectIntersection(
      checkBoxAndSegmentIntersection(box, segment),
    );

    const [point1, point2] = sortPoints(intersection.contactPoints);

    expectToBeClose(point1, -Math.sqrt(8), 0);
    expectToBeClose(point2, Math.sqrt(8), 0);
  });
});
