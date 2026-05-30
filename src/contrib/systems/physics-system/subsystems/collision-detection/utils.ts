import { INTERSECTION_EPSILON } from './constants';

export const isZero = (value: number): boolean =>
  Math.abs(value) <= INTERSECTION_EPSILON;

export const isDefinitelyPositive = (value: number): boolean =>
  value > INTERSECTION_EPSILON;

export const isDefinitelyNegative = (value: number): boolean =>
  value < -INTERSECTION_EPSILON;

export const isGreaterThan = (left: number, right: number): boolean =>
  isDefinitelyPositive(left - right);

export const isLessThan = (left: number, right: number): boolean =>
  isDefinitelyNegative(left - right);
