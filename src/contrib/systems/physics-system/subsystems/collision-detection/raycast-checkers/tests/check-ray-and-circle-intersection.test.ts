import { checkRayAndCircleIntersection } from '../ray-circle/check-ray-and-circle-intersection';
import {
  createCircleGeometry,
  createProxy,
  createRayGeometry,
  expectCastHit,
  expectToBeClose,
} from '../../intersection-checkers/tests/helpers';

describe('PhysicsSystem -> collision-detection -> checkRayAndCircleIntersection()', () => {
  it('Returns false when ray misses the circle', () => {
    const ray = createProxy(createRayGeometry(-3, 2, 1, 0, 10));
    const circle = createProxy(createCircleGeometry(0, 0, 1));

    expect(checkRayAndCircleIntersection(ray, circle)).toBe(false);
  });

  it('Returns entry contact when ray starts outside the circle', () => {
    const ray = createProxy(createRayGeometry(-3, 0, 1, 0, 10));
    const circle = createProxy(createCircleGeometry(0, 0, 1));

    const hit = expectCastHit(checkRayAndCircleIntersection(ray, circle));

    expectToBeClose(hit.normal, -1, 0);
    expect(hit.distance).toBeCloseTo(2);
    expectToBeClose(hit.point, -1, 0);
  });

  it('Returns zero-distance contact when ray starts inside the circle', () => {
    const ray = createProxy(createRayGeometry(0.5, 0, 1, 0, 10));
    const circle = createProxy(createCircleGeometry(0, 0, 1));

    const hit = expectCastHit(checkRayAndCircleIntersection(ray, circle));

    expectToBeClose(hit.normal, 1, 0);
    expect(hit.distance).toBeCloseTo(0);
    expectToBeClose(hit.point, 0.5, 0);
  });

  it('Uses the fallback normal when ray starts at the circle center', () => {
    const ray = createProxy(createRayGeometry(0, 0, 0, 1, 10));
    const circle = createProxy(createCircleGeometry(0, 0, 2));

    const hit = expectCastHit(checkRayAndCircleIntersection(ray, circle));

    expectToBeClose(hit.normal, 0, -1);
    expect(hit.distance).toBeCloseTo(0);
    expectToBeClose(hit.point, 0, 0);
  });

  it('Returns tangent contact when ray just touches the circle', () => {
    const ray = createProxy(createRayGeometry(-3, 1, 1, 0, 10));
    const circle = createProxy(createCircleGeometry(0, 0, 1));

    const hit = expectCastHit(checkRayAndCircleIntersection(ray, circle));

    expectToBeClose(hit.normal, 0, 1);
    expect(hit.distance).toBeCloseTo(3);
    expectToBeClose(hit.point, 0, 1);
  });

  it('Returns false when the hit would be beyond max distance', () => {
    const ray = createProxy(createRayGeometry(-3, 0, 1, 0, 1));
    const circle = createProxy(createCircleGeometry(0, 0, 1));

    expect(checkRayAndCircleIntersection(ray, circle)).toBe(false);
  });
});
