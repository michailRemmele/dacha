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
    if (this.sampleSize === 0) {
      return;
    }

    this.sampleSize -= 1;

    if (this.sampleSize === 0) {
      this.sum = 0;
      this.squaredSum = 0;
    } else {
      const average = (aabb.min[this.axis] + aabb.max[this.axis]) * 0.5;

      this.sum -= average;
      this.squaredSum -= average ** 2;
    }
  }

  getDispersion(): number {
    if (this.sampleSize <= 1) {
      return 0;
    }

    const average = this.sum / this.sampleSize;
    const dispersion = this.squaredSum / this.sampleSize - average ** 2;

    return Math.max(0, dispersion);
  }
}
