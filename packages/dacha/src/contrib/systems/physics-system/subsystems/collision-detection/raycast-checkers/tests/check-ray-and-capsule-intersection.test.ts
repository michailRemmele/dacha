import { checkRayAndCapsuleIntersection } from '../ray-capsule/check-ray-and-capsule-intersection';
import {
  createCapsuleGeometry,
  createRayGeometry,
  expectCastHit,
  expectToBeClose,
} from '../../intersection-checkers/tests/helpers';

describe('PhysicsSystem -> collision-detection -> checkRayAndCapsuleIntersection()', () => {
  it('Returns false when a ray misses a capsule', () => {
    const capsule = createCapsuleGeometry(-2, 0, 2, 0, 1);
    const ray = createRayGeometry(-5, 2, 1, 0, 10);

    expect(checkRayAndCapsuleIntersection(ray, capsule)).toBe(false);
  });

  it('Raycasts against a capsule cap', () => {
    const capsule = createCapsuleGeometry(-2, 0, 2, 0, 1);
    const ray = createRayGeometry(-5, 0, 1, 0, 10);
    const hit = expectCastHit(checkRayAndCapsuleIntersection(ray, capsule));

    expect(hit.distance).toBeCloseTo(2);
    expectToBeClose(hit.normal, -1, 0);
    expectToBeClose(hit.point, -3, 0);
  });

  it('Raycasts against a capsule side', () => {
    const capsule = createCapsuleGeometry(-2, 0, 2, 0, 1);
    const ray = createRayGeometry(0, 5, 0, -1, 10);
    const hit = expectCastHit(checkRayAndCapsuleIntersection(ray, capsule));

    expect(hit.distance).toBeCloseTo(4);
    expectToBeClose(hit.normal, 0, 1);
    expectToBeClose(hit.point, 0, 1);
  });

  it('Returns false when the nearest capsule hit is beyond max distance', () => {
    const capsule = createCapsuleGeometry(-2, 0, 2, 0, 1);
    const ray = createRayGeometry(-5, 0, 1, 0, 1);

    expect(checkRayAndCapsuleIntersection(ray, capsule)).toBe(false);
  });

  it('Returns the exit hit when the ray starts inside the capsule side', () => {
    const capsule = createCapsuleGeometry(-2, 0, 2, 0, 1);
    const ray = createRayGeometry(0, 0, 0, 1, 10);
    const hit = expectCastHit(checkRayAndCapsuleIntersection(ray, capsule));

    expect(hit.distance).toBeCloseTo(1);
    expectToBeClose(hit.normal, 0, -1);
    expectToBeClose(hit.point, 0, 1);
  });
});
