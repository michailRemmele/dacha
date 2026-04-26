import { checkRayAndCapsuleIntersection } from '../ray-capsule/check-ray-and-capsule-intersection';
import {
  createCapsuleGeometry,
  createProxy,
  createRayGeometry,
  expectIntersection,
  expectToBeClose,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> checkRayAndCapsuleIntersection()', () => {
  it('Returns false when a ray misses a capsule', () => {
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));
    const ray = createProxy(createRayGeometry(-5, 2, 1, 0, 10));

    expect(checkRayAndCapsuleIntersection(ray, capsule)).toBe(false);
  });

  it('Raycasts against a capsule cap', () => {
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));
    const ray = createProxy(createRayGeometry(-5, 0, 1, 0, 10));
    const intersection = expectIntersection(
      checkRayAndCapsuleIntersection(ray, capsule),
    );

    expect(intersection.distance).toBeCloseTo(2);
    expectToBeClose(intersection.normal, -1, 0);
    expectToBeClose(intersection.contactPoints[0], -3, 0);
  });

  it('Raycasts against a capsule side', () => {
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));
    const ray = createProxy(createRayGeometry(0, 5, 0, -1, 10));
    const intersection = expectIntersection(
      checkRayAndCapsuleIntersection(ray, capsule),
    );

    expect(intersection.distance).toBeCloseTo(4);
    expectToBeClose(intersection.normal, 0, 1);
    expectToBeClose(intersection.contactPoints[0], 0, 1);
  });

  it('Returns false when the nearest capsule hit is beyond max distance', () => {
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));
    const ray = createProxy(createRayGeometry(-5, 0, 1, 0, 1));

    expect(checkRayAndCapsuleIntersection(ray, capsule)).toBe(false);
  });

  it('Returns the exit hit when the ray starts inside the capsule side', () => {
    const capsule = createProxy(createCapsuleGeometry(-2, 0, 2, 0, 1));
    const ray = createProxy(createRayGeometry(0, 0, 0, 1, 10));
    const intersection = expectIntersection(
      checkRayAndCapsuleIntersection(ray, capsule),
    );

    expect(intersection.distance).toBeCloseTo(1);
    expectToBeClose(intersection.normal, 0, -1);
    expectToBeClose(intersection.contactPoints[0], 0, 1);
  });
});
