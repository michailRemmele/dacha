import { checkRayAndSegmentIntersection } from '../ray-segment/check-ray-and-segment-intersection';
import {
  createProxy,
  createRayGeometry,
  createSegmentGeometry,
  expectCastHit,
  expectToBeClose,
} from '../../intersection-checkers/tests/helpers';

describe('PhysicsSystem -> collision-detection -> checkRayAndSegmentIntersection()', () => {
  it('Returns false when the ray misses the segment', () => {
    const ray = createProxy(createRayGeometry(0, 0, 1, 0, 10));
    const segment = createProxy(createSegmentGeometry(4, 1, 4, 3));

    expect(checkRayAndSegmentIntersection(ray, segment)).toBe(false);
  });

  it('Returns the nearest hit when the ray intersects the segment', () => {
    const ray = createProxy(createRayGeometry(0, 0, 1, 0, 10));
    const segment = createProxy(createSegmentGeometry(4, -2, 4, 2));

    const hit = expectCastHit(checkRayAndSegmentIntersection(ray, segment));

    expect(hit.distance).toBeCloseTo(4);
    expectToBeClose(hit.point, 4, 0);
    expectToBeClose(hit.normal, -1, 0);
  });
});
