import {
  createBoxGeometry,
  createCapsuleGeometry,
  createCircleGeometry,
  createSegmentGeometry,
  expectToBeClose,
} from '../../intersection-checkers/tests/helpers';
import { checkCapsuleCastAndBox } from '../capsule-box/check-capsule-cast-and-box';
import { checkCapsuleCastAndCapsule } from '../capsule-capsule/check-capsule-cast-and-capsule';
import { checkCapsuleCastAndCircle } from '../capsule-circle/check-capsule-cast-and-circle';
import { checkCapsuleCastAndSegment } from '../capsule-segment/check-capsule-cast-and-segment';
import { createCapsuleCastGeometry, expectShapeCastHit } from './helpers';

describe('PhysicsSystem -> collision-detection -> capsule shape casts', () => {
  it('Casts a capsule against a circle', () => {
    const query = createCapsuleCastGeometry(0, 0, 4, 1, 1, 0, 10);
    const target = createCircleGeometry(5, 0, 1);

    const hit = expectShapeCastHit(checkCapsuleCastAndCircle(query, target));

    expect(hit.distance).toBeCloseTo(3);
    expectToBeClose(hit.normal, -1, 0);
    expectToBeClose(hit.point, 4, 0);
  });

  it('Casts a capsule diagonally against a circle', () => {
    const query = createCapsuleCastGeometry(0, 0, 4, 1, 1, 1, 10);
    const target = createCircleGeometry(5, 7, 1);

    const hit = expectShapeCastHit(checkCapsuleCastAndCircle(query, target));

    expect(hit.distance).toBeCloseTo(5 * Math.SQRT2 - 2);
    expectToBeClose(hit.normal, -Math.SQRT1_2, -Math.SQRT1_2);
    expectToBeClose(hit.point, 5 - Math.SQRT1_2, 7 - Math.SQRT1_2);
  });

  it('Casts a capsule against a segment', () => {
    const query = createCapsuleCastGeometry(0, 0, 4, 1, 1, 0, 10);
    const target = createSegmentGeometry(5, -1, 5, 1);

    const hit = expectShapeCastHit(checkCapsuleCastAndSegment(query, target));

    expect(hit.distance).toBeCloseTo(4);
    expectToBeClose(hit.normal, -1, 0);
    expectToBeClose(hit.point, 5, -1);
  });

  it('Casts a capsule against a capsule', () => {
    const query = createCapsuleCastGeometry(0, 0, 4, 1, 1, 0, 10);
    const target = createCapsuleGeometry(5, -1, 5, 1, 1);

    const hit = expectShapeCastHit(checkCapsuleCastAndCapsule(query, target));

    expect(hit.distance).toBeCloseTo(3);
    expectToBeClose(hit.normal, -1, 0);
    expectToBeClose(hit.point, 4, -1);
  });

  it('Casts a capsule against a box', () => {
    const query = createCapsuleCastGeometry(0, 0, 4, 1, 1, 0, 10);
    const target = createBoxGeometry(5, 0, 2, 2);

    const hit = expectShapeCastHit(checkCapsuleCastAndBox(query, target));

    expect(hit.distance).toBeCloseTo(3);
    expectToBeClose(hit.normal, -1, 0);
    expectToBeClose(hit.point, 4, -1);
  });

  it('Returns initial overlap for overlapping capsules', () => {
    const query = createCapsuleCastGeometry(4.5, 0, 4, 1, 1, 0, 10);
    const target = createCapsuleGeometry(5, -1, 5, 1, 1);

    const hit = expectShapeCastHit(checkCapsuleCastAndCapsule(query, target));

    expect(hit.distance).toBeCloseTo(0);
    expectToBeClose(hit.normal, -1, 0);
  });

  it('Returns false when a capsule cast misses', () => {
    const query = createCapsuleCastGeometry(0, 5, 4, 1, 1, 0, 10);
    const target = createCircleGeometry(5, 0, 1);

    expect(checkCapsuleCastAndCircle(query, target)).toBe(false);
  });
});
