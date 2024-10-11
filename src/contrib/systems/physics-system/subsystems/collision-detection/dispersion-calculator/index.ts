import type { Axis, AABB } from '../types';

export class DispersionCalculator {
  private axis: Axis;
  private sampleSize: number;
  private sum: number;
  private squaredSum: number;

  constructor(axis: Axis) {
    this.axis = axis;
    this.sampleSize = 0;
    this.sum = 0;
    this.squaredSum = 0;
  }

  addToSample(aabb: AABB): void {
    const average = (aabb.min[this.axis] + aabb.max[this.axis]) * 0.5;

    this.sum += average;
    this.squaredSum += average ** 2;

    this.sampleSize += 1;
  }

  removeFromSample(aabb: AABB): void {
    const average = (aabb.min[this.axis] + aabb.max[this.axis]) * 0.5;

    this.sum -= average;
    this.squaredSum -= average ** 2;

    this.sampleSize -= 1;
  }

  getDispersion(): number {
    return (this.squaredSum / this.sampleSize) - (this.sum / this.sampleSize) ** 2;
  }
}
