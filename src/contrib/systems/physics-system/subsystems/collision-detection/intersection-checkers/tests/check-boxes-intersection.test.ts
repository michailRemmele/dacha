import { checkBoxesIntersection } from '../box-box/check-boxes-intersection';
import {
  createBoxGeometry,
  createProxy,
  createRotatedBoxGeometry,
  expectIntersection,
  expectToBeClose,
  sortPoints,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> checkBoxesIntersection()', () => {
  it('Returns false for separated boxes', () => {
    const box1 = createProxy('box', createBoxGeometry(0, 0, 2, 2));
    const box2 = createProxy('box', createBoxGeometry(5, 0, 2, 2));

    expect(checkBoxesIntersection(box1, box2)).toBe(false);
  });

  it('Returns manifold for overlapping axis-aligned boxes', () => {
    const box1 = createProxy('box', createBoxGeometry(0, 0, 2, 2));
    const box2 = createProxy('box', createBoxGeometry(1.5, 0, 2, 2));

    const intersection = expectIntersection(checkBoxesIntersection(box1, box2));
    const [point1, point2] = sortPoints(intersection.contactPoints);

    expect(intersection.penetration).toBeCloseTo(0.5);
    expect(intersection.normal.magnitude).toBeCloseTo(1);
    expect(intersection.normal.x).toBeGreaterThan(0);
    expect(intersection.contactPoints.length).toEqual(2);
    expectToBeClose(point1, 1, -1);
    expectToBeClose(point2, 1, 1);
  });

  it('Returns zero-penetration manifold when boxes are just touching', () => {
    const box1 = createProxy('box', createBoxGeometry(0, 0, 2, 2));
    const box2 = createProxy('box', createBoxGeometry(2, 0, 2, 2));

    const intersection = expectIntersection(checkBoxesIntersection(box1, box2));
    const [point1, point2] = sortPoints(intersection.contactPoints);

    expect(intersection.penetration).toBeCloseTo(0);
    expect(intersection.normal.magnitude).toBeCloseTo(1);
    expect(intersection.normal.x).toBeGreaterThan(0);
    expect(intersection.contactPoints.length).toEqual(2);
    expectToBeClose(point1, 1, -1);
    expectToBeClose(point2, 1, 1);
  });

  it('Returns stable manifold for rotated-vs-axis-aligned overlap', () => {
    const box1Geometry = createBoxGeometry(0, 0, 4, 2);
    const box2Geometry = createRotatedBoxGeometry(1.2, 0.2, 2, 2, Math.PI / 4);

    const box1 = createProxy('box', box1Geometry);
    const box2 = createProxy('box', box2Geometry);

    const intersection = expectIntersection(checkBoxesIntersection(box1, box2));

    expect(intersection.normal.magnitude).toBeCloseTo(1);
    expect(intersection.penetration).toBeGreaterThan(0);
    expect(intersection.contactPoints.length).toBeGreaterThan(0);
    expect(intersection.contactPoints.length).toBeLessThanOrEqual(2);
  });

  it('Returns two contact points for a face-like overlap case', () => {
    const box1 = createProxy('box', createBoxGeometry(0, 0, 4, 2));
    const box2 = createProxy('box', createBoxGeometry(0, 0.8, 4, 2));

    const intersection = expectIntersection(checkBoxesIntersection(box1, box2));
    const [point1, point2] = sortPoints(intersection.contactPoints);

    expect(intersection.contactPoints.length).toEqual(2);
    expect(intersection.penetration).toBeCloseTo(1.2);
    expectToBeClose(point1, -2, 1);
    expectToBeClose(point2, 2, 1);
  });

  it('Returns a bounded manifold for a corner-vs-face overlap', () => {
    const box1 = createProxy('box', createBoxGeometry(0, 0, 2, 2));
    const box2 = createProxy(
      'box',
      createRotatedBoxGeometry(0.9, 0.9, 2, 2, Math.PI / 4),
    );

    const intersection = expectIntersection(checkBoxesIntersection(box1, box2));

    expect(intersection.contactPoints.length).toBeGreaterThan(0);
    expect(intersection.contactPoints.length).toBeLessThanOrEqual(2);
    expect(intersection.penetration).toBeGreaterThan(0);
  });
});
