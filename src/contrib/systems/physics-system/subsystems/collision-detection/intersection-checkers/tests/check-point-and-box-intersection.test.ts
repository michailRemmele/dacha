import { checkPointAndBoxIntersection } from '../point-box/check-point-and-box-intersection';
import {
  createBoxGeometry,
  createPointGeometry,
  createProxy,
  expectIntersection,
  expectToBeClose,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> checkPointAndBoxIntersection()', () => {
  it('Returns false when point is outside the box', () => {
    const point = createProxy(createPointGeometry(3, 0));
    const box = createProxy(createBoxGeometry(0, 0, 2, 2));

    expect(checkPointAndBoxIntersection(point, box)).toBe(false);
  });

  it('Returns nearest-edge manifold when point is inside the box', () => {
    const point = createProxy(createPointGeometry(0.75, 0));
    const box = createProxy(createBoxGeometry(0, 0, 2, 2));

    const intersection = expectIntersection(
      checkPointAndBoxIntersection(point, box),
    );

    expectToBeClose(intersection.normal, -1, 0);
    expect(intersection.penetration).toBeCloseTo(0.25);
    expect(intersection.contactPoints).toHaveLength(1);
    expectToBeClose(intersection.contactPoints[0], 1, 0);
  });

  it('Returns zero-penetration contact when point lies on the box edge', () => {
    const point = createProxy(createPointGeometry(1, 0));
    const box = createProxy(createBoxGeometry(0, 0, 2, 2));

    const intersection = expectIntersection(
      checkPointAndBoxIntersection(point, box),
    );

    expectToBeClose(intersection.normal, -1, 0);
    expect(intersection.penetration).toBeCloseTo(0);
    expectToBeClose(intersection.contactPoints[0], 1, 0);
  });
});
