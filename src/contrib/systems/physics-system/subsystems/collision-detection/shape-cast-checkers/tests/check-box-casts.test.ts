import {
  createBoxGeometry,
  createCapsuleGeometry,
  createCircleGeometry,
  createSegmentGeometry,
  expectToBeClose,
} from '../../intersection-checkers/tests/helpers';
import { checkBoxCastAndBox } from '../box-box/check-box-cast-and-box';
import { checkBoxCastAndCapsule } from '../box-capsule/check-box-cast-and-capsule';
import { checkBoxCastAndCircle } from '../box-circle/check-box-cast-and-circle';
import { checkBoxCastAndSegment } from '../box-segment/check-box-cast-and-segment';
import {
  createBoxCastGeometry,
  createQueryProxy,
  createTargetProxy,
  expectShapeCastHit,
} from './helpers';

describe('PhysicsSystem -> collision-detection -> box shape casts', () => {
  it('Casts a box against a circle', () => {
    const query = createQueryProxy(createBoxCastGeometry(0, 0, 2, 2, 1, 0, 10));
    const target = createTargetProxy(createCircleGeometry(5, 0, 1));

    const hit = expectShapeCastHit(checkBoxCastAndCircle(query, target));

    expect(hit.distance).toBeCloseTo(3);
    expectToBeClose(hit.normal, -1, 0);
    expectToBeClose(hit.point, 4, 0);
  });

  it('Casts a box diagonally against a circle', () => {
    const query = createQueryProxy(createBoxCastGeometry(0, 0, 2, 2, 1, 1, 10));
    const target = createTargetProxy(createCircleGeometry(5, 5, 1));

    const hit = expectShapeCastHit(checkBoxCastAndCircle(query, target));

    expect(hit.distance).toBeCloseTo(4 * Math.SQRT2 - 1);
    expectToBeClose(hit.normal, -Math.SQRT1_2, -Math.SQRT1_2);
    expectToBeClose(
      hit.point,
      (4 * Math.SQRT2 - 1) * Math.SQRT1_2 + 1,
      (4 * Math.SQRT2 - 1) * Math.SQRT1_2 + 1,
    );
  });

  it('Casts a box against a segment', () => {
    const query = createQueryProxy(createBoxCastGeometry(0, 0, 2, 2, 1, 0, 10));
    const target = createTargetProxy(createSegmentGeometry(5, -1, 5, 1));

    const hit = expectShapeCastHit(checkBoxCastAndSegment(query, target));

    expect(hit.distance).toBeCloseTo(4);
    expectToBeClose(hit.normal, -1, 0);
    expectToBeClose(hit.point, 5, 0);
  });

  it('Casts a box against a capsule', () => {
    const query = createQueryProxy(createBoxCastGeometry(0, 0, 2, 2, 1, 0, 10));
    const target = createTargetProxy(createCapsuleGeometry(5, -1, 5, 1, 1));

    const hit = expectShapeCastHit(checkBoxCastAndCapsule(query, target));

    expect(hit.distance).toBeCloseTo(3);
    expectToBeClose(hit.normal, -1, 0);
    expectToBeClose(hit.point, 4, 0);
  });

  it('Casts a box against a box', () => {
    const query = createQueryProxy(createBoxCastGeometry(0, 0, 2, 2, 1, 0, 10));
    const target = createTargetProxy(createBoxGeometry(5, 0, 2, 2));

    const hit = expectShapeCastHit(checkBoxCastAndBox(query, target));

    expect(hit.distance).toBeCloseTo(3);
    expectToBeClose(hit.normal, -1, 0);
    expectToBeClose(hit.point, 4, 0);
  });

  it('Uses precomputed half extents for the support point', () => {
    const query = createQueryProxy(createBoxCastGeometry(0, 0, 4, 2, 1, 0, 10));
    const target = createTargetProxy(createBoxGeometry(7, 0, 2, 2));

    const hit = expectShapeCastHit(checkBoxCastAndBox(query, target));

    expect(hit.distance).toBeCloseTo(4);
    expectToBeClose(hit.point, 6, 0);
  });

  it('Returns false when a box cast misses', () => {
    const query = createQueryProxy(createBoxCastGeometry(0, 4, 2, 2, 1, 0, 10));
    const target = createTargetProxy(createBoxGeometry(5, 0, 2, 2));

    expect(checkBoxCastAndBox(query, target)).toBe(false);
  });
});
