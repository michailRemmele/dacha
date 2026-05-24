import { checkRayAndBoxIntersection } from '../ray-box/check-ray-and-box-intersection';
import {
  createBoxGeometry,
  createProxy,
  createRayGeometry,
  expectCastHit,
  expectToBeClose,
} from '../../intersection-checkers/tests/helpers';

describe('PhysicsSystem -> collision-detection -> checkRayAndBoxIntersection()', () => {
  it('Returns false when ray misses the box', () => {
    const ray = createProxy(createRayGeometry(-3, 2, 1, 0, 10));
    const box = createProxy(createBoxGeometry(0, 0, 2, 2));

    expect(checkRayAndBoxIntersection(ray, box)).toBe(false);
  });

  it('Returns entry contact when ray starts outside the box', () => {
    const ray = createProxy(createRayGeometry(-3, 0, 1, 0, 10));
    const box = createProxy(createBoxGeometry(0, 0, 2, 2));

    const hit = expectCastHit(checkRayAndBoxIntersection(ray, box));

    expectToBeClose(hit.normal, -1, 0);
    expect(hit.distance).toBeCloseTo(2);
    expectToBeClose(hit.point, -1, 0);
  });

  it('Returns exit contact when ray starts inside the box', () => {
    const ray = createProxy(createRayGeometry(0, 0, 1, 0, 10));
    const box = createProxy(createBoxGeometry(0, 0, 2, 2));

    const hit = expectCastHit(checkRayAndBoxIntersection(ray, box));

    expectToBeClose(hit.normal, 1, 0);
    expect(hit.distance).toBeCloseTo(1);
    expectToBeClose(hit.point, 1, 0);
  });

  it('Returns zero-distance contact when ray starts on the box boundary', () => {
    const ray = createProxy(createRayGeometry(-1, 0, 1, 0, 10));
    const box = createProxy(createBoxGeometry(0, 0, 2, 2));

    const hit = expectCastHit(checkRayAndBoxIntersection(ray, box));

    expectToBeClose(hit.normal, -1, 0);
    expect(hit.distance).toBeCloseTo(0);
    expectToBeClose(hit.point, -1, 0);
  });

  it('Returns false when the hit would be beyond max distance', () => {
    const ray = createProxy(createRayGeometry(-3, 0, 1, 0, 1));
    const box = createProxy(createBoxGeometry(0, 0, 2, 2));

    expect(checkRayAndBoxIntersection(ray, box)).toBe(false);
  });
});
