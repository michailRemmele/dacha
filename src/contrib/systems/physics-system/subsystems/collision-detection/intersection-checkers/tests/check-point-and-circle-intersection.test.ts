import { checkPointAndCircleIntersection } from '../point-circle/check-point-and-circle-intersection';
import {
  createCircleGeometry,
  createPointGeometry,
  createProxy,
  expectIntersection,
  expectToBeClose,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> checkPointAndCircleIntersection()', () => {
  it('Returns false when point is outside the circle', () => {
    const point = createProxy(createPointGeometry(3, 0));
    const circle = createProxy(createCircleGeometry(0, 0, 2));

    expect(checkPointAndCircleIntersection(point, circle)).toBe(false);
  });

  it('Returns boundary manifold when point is inside the circle', () => {
    const point = createProxy(createPointGeometry(1, 0));
    const circle = createProxy(createCircleGeometry(0, 0, 2));

    const intersection = expectIntersection(
      checkPointAndCircleIntersection(point, circle),
    );

    expectToBeClose(intersection.normal, -1, 0);
    expect(intersection.penetration).toBeCloseTo(1);
    expect(intersection.contactPoints).toHaveLength(1);
    expectToBeClose(intersection.contactPoints[0], 2, 0);
  });

  it('Uses fallback normal when point matches the circle center', () => {
    const point = createProxy(createPointGeometry(5, -2));
    const circle = createProxy(createCircleGeometry(5, -2, 3));

    const intersection = expectIntersection(
      checkPointAndCircleIntersection(circle, point),
    );

    expectToBeClose(intersection.normal, 1, 0);
    expect(intersection.penetration).toBeCloseTo(3);
    expectToBeClose(intersection.contactPoints[0], 8, -2);
  });
});
