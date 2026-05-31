import {
  createBoxGeometry,
  createCapsuleGeometry,
  createCircleGeometry,
  createRotatedBoxGeometry,
  createSegmentGeometry,
  expectToBeClose,
} from '../../intersection-checkers/tests/helpers';
import { checkCircleCastAndBox } from '../circle-box/check-circle-cast-and-box';
import { checkCircleCastAndCapsule } from '../circle-capsule/check-circle-cast-and-capsule';
import { checkCircleCastAndCircle } from '../circle-circle/check-circle-cast-and-circle';
import { checkCircleCastAndSegment } from '../circle-segment/check-circle-cast-and-segment';
import { createCircleCastGeometry, expectShapeCastHit } from './helpers';

describe('PhysicsSystem -> collision-detection -> circle shape casts', () => {
  it('Casts a circle against a circle', () => {
    const query = createCircleCastGeometry(0, 0, 1, 1, 0, 10);
    const target = createCircleGeometry(5, 0, 1);

    const hit = expectShapeCastHit(checkCircleCastAndCircle(query, target));

    expect(hit.distance).toBeCloseTo(3);
    expectToBeClose(hit.normal, -1, 0);
    expectToBeClose(hit.point, 4, 0);
  });

  it('Casts a circle diagonally against a circle', () => {
    const query = createCircleCastGeometry(0, 0, 1, 1, 1, 10);
    const target = createCircleGeometry(5, 5, 1);

    const hit = expectShapeCastHit(checkCircleCastAndCircle(query, target));

    expect(hit.distance).toBeCloseTo(5 * Math.SQRT2 - 2);
    expectToBeClose(hit.normal, -Math.SQRT1_2, -Math.SQRT1_2);
    expectToBeClose(hit.point, 5 - Math.SQRT1_2, 5 - Math.SQRT1_2);
  });

  it('Casts a circle against a segment', () => {
    const query = createCircleCastGeometry(0, 0, 1, 1, 0, 10);
    const target = createSegmentGeometry(5, -1, 5, 1);

    const hit = expectShapeCastHit(checkCircleCastAndSegment(query, target));

    expect(hit.distance).toBeCloseTo(4);
    expectToBeClose(hit.normal, -1, 0);
    expectToBeClose(hit.point, 5, 0);
  });

  it('Casts a circle against a capsule', () => {
    const query = createCircleCastGeometry(0, 0, 1, 1, 0, 10);
    const target = createCapsuleGeometry(5, -1, 5, 1, 1);

    const hit = expectShapeCastHit(checkCircleCastAndCapsule(query, target));

    expect(hit.distance).toBeCloseTo(3);
    expectToBeClose(hit.normal, -1, 0);
    expectToBeClose(hit.point, 4, 0);
  });

  it('Casts a circle against a box', () => {
    const query = createCircleCastGeometry(0, 0, 1, 1, 0, 10);
    const target = createBoxGeometry(5, 0, 2, 2);

    const hit = expectShapeCastHit(checkCircleCastAndBox(query, target));

    expect(hit.distance).toBeCloseTo(3);
    expectToBeClose(hit.normal, -1, 0);
    expectToBeClose(hit.point, 4, 0);
  });

  it('Casts a circle against a rotated box', () => {
    const query = createCircleCastGeometry(0, 5, 1, 1, 0, 10);
    const target = createRotatedBoxGeometry(
      5,
      5,
      2 * Math.SQRT2,
      2 * Math.SQRT2,
      Math.PI / 4,
    );

    const hit = expectShapeCastHit(checkCircleCastAndBox(query, target));

    expect(hit.distance).toBeCloseTo(2);
    expectToBeClose(hit.normal, -1, 0);
    expectToBeClose(hit.point, 3, 5);
  });

  it('Returns initial overlap for overlapping circles', () => {
    const query = createCircleCastGeometry(4.5, 0, 1, 1, 0, 10);
    const target = createCircleGeometry(5, 0, 1);

    const hit = expectShapeCastHit(checkCircleCastAndCircle(query, target));

    expect(hit.distance).toBeCloseTo(0);
    expectToBeClose(hit.normal, -1, 0);
    expectToBeClose(hit.point, 4, 0);
  });

  it('Returns false when a circle cast misses', () => {
    const query = createCircleCastGeometry(0, 3, 1, 1, 0, 10);
    const target = createCircleGeometry(5, 0, 1);

    expect(checkCircleCastAndCircle(query, target)).toBe(false);
  });
});
