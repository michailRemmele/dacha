import { Matrix } from '../';

const EPS = 1e-10;

const expectClose = (actual: number, expected: number): void => {
  expect(Math.abs(actual - expected)).toBeLessThan(EPS);
};

describe('MathLib -> Matrix', () => {
  it('returns the identity matrix', () => {
    const m = new Matrix(2, 3, 4, 5, 6, 7).identity();

    expect(m.a).toBe(1);
    expect(m.b).toBe(0);
    expect(m.c).toBe(0);
    expect(m.d).toBe(1);
    expect(m.tx).toBe(0);
    expect(m.ty).toBe(0);
  });

  it('multiplies two matrices correctly', () => {
    const m1 = new Matrix(1, 2, 3, 4, 5, 6);
    const m2 = new Matrix(7, 8, 9, 10, 11, 12);

    const r = m1.multiply(m2);

    expect(r.a).toBe(1 * 7 + 3 * 8);
    expect(r.b).toBe(2 * 7 + 4 * 8);
    expect(r.c).toBe(1 * 9 + 3 * 10);
    expect(r.d).toBe(2 * 9 + 4 * 10);
    expect(r.tx).toBe(1 * 11 + 3 * 12 + 5);
    expect(r.ty).toBe(2 * 11 + 4 * 12 + 6);
  });

  it('identity does not change matrix when multiplied', () => {
    const m = new Matrix(2, 3, 4, 5, 6, 7);
    const id = m.identity();

    const r = m.multiply(id);

    expect(r).toEqual(m);
  });

  it('multiplies two matrices correctly (multiplyRight)', () => {
    const m1 = new Matrix(1, 2, 3, 4, 5, 6);
    const m2 = new Matrix(7, 8, 9, 10, 11, 12);

    const r = m1.multiplyRight(m2);

    expect(r.a).toBe(25);
    expect(r.b).toBe(28);
    expect(r.c).toBe(57);
    expect(r.d).toBe(64);
    expect(r.tx).toBe(100);
    expect(r.ty).toBe(112);
  });

  it('multiplies two matrices correctly (static)', () => {
    const r = new Matrix(1, 0, 0, 1, 0, 0);
    const m1 = new Matrix(1, 2, 3, 4, 5, 6);
    const m2 = new Matrix(7, 8, 9, 10, 11, 12);

    Matrix.multiply(r, m1, m2);

    expect(r.a).toBe(31);
    expect(r.b).toBe(46);
    expect(r.c).toBe(39);
    expect(r.d).toBe(58);
    expect(r.tx).toBe(52);
    expect(r.ty).toBe(76);
  });

  it('inverts a matrix correctly', () => {
    const m = new Matrix(2, 0, 0, 2, 10, 20);
    const inv = m.invert();

    expectClose(inv.a, 0.5);
    expectClose(inv.d, 0.5);
    expectClose(inv.tx, -5);
    expectClose(inv.ty, -10);
  });

  it('matrix * inverse = identity', () => {
    const m = new Matrix(1, 2, 3, 4, 5, 6);
    const inv = m.clone().invert();

    const r = m.multiply(inv);

    expectClose(r.a, 1);
    expectClose(r.b, 0);
    expectClose(r.c, 0);
    expectClose(r.d, 1);
    expectClose(r.tx, 0);
    expectClose(r.ty, 0);
  });

  it('applies matrix to a point', () => {
    const m = new Matrix(2, 3, 4, 5, 6, 7);
    const p = { x: 1, y: 2 };

    const r = m.apply(p);

    expect(r.x).toBe(2 * 1 + 4 * 2 + 6);
    expect(r.y).toBe(3 * 1 + 5 * 2 + 7);
  });

  it('identity leaves point unchanged', () => {
    const id = new Matrix(0, 0, 0, 0, 0, 0).identity();
    const p = { x: 5, y: -3 };

    const r = id.apply(p);

    expect(r).toEqual(p);
  });

  it('assigns values from another matrix', () => {
    const m1 = new Matrix(1, 2, 3, 4, 5, 6);
    const m2 = new Matrix(7, 8, 9, 10, 11, 12);

    m1.assign(m2);

    expect(m1.a).toBe(7);
    expect(m1.b).toBe(8);
    expect(m1.c).toBe(9);
    expect(m1.d).toBe(10);
    expect(m1.tx).toBe(11);
    expect(m1.ty).toBe(12);
  });

  it('assigns values from arguments', () => {
    const m1 = new Matrix(1, 2, 3, 4, 5, 6);

    m1.assign(7, 8, 9, 10, 11, 12);

    expect(m1.a).toBe(7);
    expect(m1.b).toBe(8);
    expect(m1.c).toBe(9);
    expect(m1.d).toBe(10);
    expect(m1.tx).toBe(11);
    expect(m1.ty).toBe(12);
  });
});
