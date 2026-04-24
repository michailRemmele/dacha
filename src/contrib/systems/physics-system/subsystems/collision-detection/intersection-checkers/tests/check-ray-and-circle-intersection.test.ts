import { checkRayAndCircleIntersection } from '../ray-circle/check-ray-and-circle-intersection';
import {
  createCircleGeometry,
  createProxy,
  createRayGeometry,
  expectIntersection,
  expectToBeClose,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> checkRayAndCircleIntersection()', () => {
  it('Returns false when ray misses the circle', () => {
    const ray = createProxy(createRayGeometry(-3, 2, 1, 0, 10));
    const circle = createProxy(createCircleGeometry(0, 0, 1));

    expect(checkRayAndCircleIntersection(ray, circle)).toBe(false);
  });

  it('Returns entry contact when ray starts outside the circle', () => {
    const ray = createProxy(createRayGeometry(-3, 0, 1, 0, 10));
    const circle = createProxy(createCircleGeometry(0, 0, 1));

    const intersection = expectIntersection(
      checkRayAndCircleIntersection(ray, circle),
    );

    expectToBeClose(intersection.normal, -1, 0);
    expect(intersection.distance).toBeCloseTo(2);
    expect(intersection.penetration).toBe(0);
    expect(intersection.contactPoints).toHaveLength(1);
    expectToBeClose(intersection.contactPoints[0], -1, 0);
  });

  it('Returns zero-distance contact when ray starts inside the circle', () => {
    const ray = createProxy(createRayGeometry(0.5, 0, 1, 0, 10));
    const circle = createProxy(createCircleGeometry(0, 0, 1));

    const intersection = expectIntersection(
      checkRayAndCircleIntersection(ray, circle),
    );

    expectToBeClose(intersection.normal, 1, 0);
    expect(intersection.distance).toBeCloseTo(0);
    expect(intersection.penetration).toBe(0);
    expect(intersection.contactPoints).toHaveLength(1);
    expectToBeClose(intersection.contactPoints[0], 0.5, 0);
  });

  it('Uses the fallback normal when ray starts at the circle center', () => {
    const ray = createProxy(createRayGeometry(0, 0, 0, 1, 10));
    const circle = createProxy(createCircleGeometry(0, 0, 2));

    const intersection = expectIntersection(
      checkRayAndCircleIntersection(ray, circle),
    );

    expectToBeClose(intersection.normal, 0, -1);
    expect(intersection.distance).toBeCloseTo(0);
    expect(intersection.penetration).toBe(0);
    expectToBeClose(intersection.contactPoints[0], 0, 0);
  });

  it('Returns tangent contact when ray just touches the circle', () => {
    const ray = createProxy(createRayGeometry(-3, 1, 1, 0, 10));
    const circle = createProxy(createCircleGeometry(0, 0, 1));

    const intersection = expectIntersection(
      checkRayAndCircleIntersection(ray, circle),
    );

    expectToBeClose(intersection.normal, 0, 1);
    expect(intersection.distance).toBeCloseTo(3);
    expect(intersection.penetration).toBe(0);
    expect(intersection.contactPoints).toHaveLength(1);
    expectToBeClose(intersection.contactPoints[0], 0, 1);
  });

  it('Returns false when the hit would be beyond max distance', () => {
    const ray = createProxy(createRayGeometry(-3, 0, 1, 0, 1));
    const circle = createProxy(createCircleGeometry(0, 0, 1));

    expect(checkRayAndCircleIntersection(ray, circle)).toBe(false);
  });
});
