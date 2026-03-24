import { checkBoxAndCircleIntersection } from '../box-circle/check-box-and-circle-intersection';
import {
  createBoxGeometry,
  createCircleGeometry,
  createProxy,
  expectIntersection,
  expectToBeClose,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> checkBoxAndCircleIntersection()', () => {
  it('Returns false when circle is outside and not touching the box', () => {
    const box = createProxy('box', createBoxGeometry(0, 0, 4, 4));
    const circle = createProxy('circle', createCircleGeometry(4, 4, 0.5));

    expect(checkBoxAndCircleIntersection(box, circle)).toBe(false);
  });

  it('Returns edge contact for circle touching box from the right', () => {
    const box = createProxy('box', createBoxGeometry(0, 0, 2, 2));
    const circle = createProxy('circle', createCircleGeometry(1.4, 0, 0.6));

    const intersection = expectIntersection(
      checkBoxAndCircleIntersection(box, circle),
    );

    expectToBeClose(intersection.normal, 1, 0);
    expect(intersection.penetration).toBeCloseTo(0.2);
    expect(intersection.contactPoints).toHaveLength(1);
    expectToBeClose(intersection.contactPoints[0], 1, 0);
  });

  it('Returns zero-penetration contact when circle is just touching the box', () => {
    const box = createProxy('box', createBoxGeometry(0, 0, 2, 2));
    const circle = createProxy('circle', createCircleGeometry(1.6, 0, 0.6));

    const intersection = expectIntersection(
      checkBoxAndCircleIntersection(box, circle),
    );

    expectToBeClose(intersection.normal, 1, 0);
    expect(intersection.penetration).toBeCloseTo(0);
    expect(intersection.contactPoints).toHaveLength(1);
    expectToBeClose(intersection.contactPoints[0], 1, 0);
  });

  it('Returns collision when circle center is inside the box', () => {
    const box = createProxy('box', createBoxGeometry(0, 0, 4, 4));
    const circle = createProxy('circle', createCircleGeometry(0, 0, 0.5));

    const intersection = expectIntersection(
      checkBoxAndCircleIntersection(box, circle),
    );

    expect(intersection.penetration).toBeGreaterThan(0);
    expect(intersection.contactPoints).toHaveLength(1);
    expect(intersection.normal.magnitude).toBeCloseTo(1);
    expectToBeClose(intersection.contactPoints[0], -2, 0);
  });
});
