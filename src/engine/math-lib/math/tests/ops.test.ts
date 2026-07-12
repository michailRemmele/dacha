import { MathOps } from '../ops';

describe('MathOps.getAngleDelta', () => {
  it('returns the plain difference for small angles', () => {
    expect(MathOps.getAngleDelta(0, Math.PI / 2)).toBeCloseTo(Math.PI / 2);
    expect(MathOps.getAngleDelta(1, 0.5)).toBeCloseTo(-0.5);
  });

  it('goes the short way across the 0/2π boundary', () => {
    expect(MathOps.getAngleDelta(0.1, 2 * Math.PI - 0.1)).toBeCloseTo(-0.2);
    expect(MathOps.getAngleDelta(2 * Math.PI - 0.1, 0.1)).toBeCloseTo(0.2);
  });

  it('goes the short way across the ±π boundary', () => {
    expect(MathOps.getAngleDelta(3, -3)).toBeCloseTo(2 * Math.PI - 6);
    expect(MathOps.getAngleDelta(-3, 3)).toBeCloseTo(-(2 * Math.PI - 6));
  });

  it('normalizes inputs that differ by full turns', () => {
    expect(MathOps.getAngleDelta(0, 5 * Math.PI)).toBeCloseTo(Math.PI);
    expect(MathOps.getAngleDelta(0, 4 * Math.PI)).toBeCloseTo(0);
  });
});
