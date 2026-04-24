import { checkCirclesIntersection } from '../circle-circle/check-circles-intersection';
import {
  createCircleGeometry,
  createProxy,
  expectIntersection,
  expectToBeClose,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> checkCirclesIntersection()', () => {
  it('Returns false when circles are separated', () => {
    const circle1 = createProxy(createCircleGeometry(0, 0, 1));
    const circle2 = createProxy(createCircleGeometry(3, 0, 1));

    expect(checkCirclesIntersection(circle1, circle2)).toBe(false);
  });

  it('Returns normal/penetration/contact for overlapping circles', () => {
    const circle1 = createProxy(createCircleGeometry(0, 0, 2));
    const circle2 = createProxy(createCircleGeometry(3, 0, 2));

    const intersection = expectIntersection(
      checkCirclesIntersection(circle1, circle2),
    );

    expectToBeClose(intersection.normal, 1, 0);
    expect(intersection.penetration).toBeCloseTo(1);
    expect(intersection.contactPoints).toHaveLength(1);
    expectToBeClose(intersection.contactPoints[0], 2, 0);
  });

  it('Returns zero-penetration contact when circles are just touching', () => {
    const circle1 = createProxy(createCircleGeometry(0, 0, 1));
    const circle2 = createProxy(createCircleGeometry(2, 0, 1));

    const intersection = expectIntersection(
      checkCirclesIntersection(circle1, circle2),
    );

    expectToBeClose(intersection.normal, 1, 0);
    expect(intersection.penetration).toBeCloseTo(0);
    expect(intersection.contactPoints).toHaveLength(1);
    expectToBeClose(intersection.contactPoints[0], 1, 0);
  });

  it('Uses fallback normal for concentric circles (same center)', () => {
    const circle1 = createProxy(createCircleGeometry(5, -2, 2));
    const circle2 = createProxy(createCircleGeometry(5, -2, 1));

    const intersection = expectIntersection(
      checkCirclesIntersection(circle1, circle2),
    );

    expectToBeClose(intersection.normal, 1, 0);
    expect(intersection.penetration).toBeCloseTo(3);
    expectToBeClose(intersection.contactPoints[0], 7, -2);
  });
});
