import { checkRayAndSegmentIntersection } from '../ray-segment/check-ray-and-segment-intersection';
import {
  createProxy,
  createRayGeometry,
  createSegmentGeometry,
  expectIntersection,
  expectToBeClose,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> checkRayAndSegmentIntersection()', () => {
  it('Returns false when the ray misses the segment', () => {
    const ray = createProxy(createRayGeometry(0, 0, 1, 0, 10));
    const segment = createProxy(createSegmentGeometry(4, 1, 4, 3));

    expect(checkRayAndSegmentIntersection(ray, segment)).toBe(false);
  });

  it('Returns the nearest hit when the ray intersects the segment', () => {
    const ray = createProxy(createRayGeometry(0, 0, 1, 0, 10));
    const segment = createProxy(createSegmentGeometry(4, -2, 4, 2));

    const intersection = expectIntersection(
      checkRayAndSegmentIntersection(ray, segment),
    );

    expect(intersection.distance).toBeCloseTo(4);
    expectToBeClose(intersection.contactPoints[0], 4, 0);
    expectToBeClose(intersection.normal, -1, 0);
  });
});
