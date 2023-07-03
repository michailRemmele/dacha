export class DispersionCalculator {
  private sample: Record<string, number | undefined>;
  private sampleSize: number;
  private sum: number;
  private squaredSum: number;

  constructor() {
    this.sample = {};
    this.sampleSize = 0;
    this.sum = 0;
    this.squaredSum = 0;
  }

  addToSample(key: string, value: number): void {
    this.removeFromSample(key);

    this.sum += value;
    this.squaredSum += value ** 2;

    this.sample[key] = value;
    this.sampleSize += 1;
  }

  removeFromSample(key: string): void {
    const sample = this.sample[key];
    if (sample === undefined) {
      return;
    }

    this.sum -= sample;
    this.squaredSum -= sample ** 2;

    delete this.sample[key];
    this.sampleSize -= 1;
  }

  getDispersion(): number {
    return (this.squaredSum / this.sampleSize) - (this.sum / this.sampleSize) ** 2;
  }
}
