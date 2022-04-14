class DispersionCalculator {
  constructor() {
    this._sample = {};
    this._sampleSize = 0;
    this._sum = 0;
    this._squaredSum = 0;
  }

  addToSample(key, value) {
    this.removeFromSample(key);

    this._sum += value;
    this._squaredSum += Math.pow(value, 2);

    this._sample[key] = value;
    this._sampleSize += 1;
  }

  removeFromSample(key) {
    if (!this._sample[key]) {
      return;
    }

    this._sum -= this._sample[key];
    this._squaredSum -= Math.pow(this._sample[key], 2);

    this._sample[key] = null;
    this._sampleSize -= 1;
  }

  getDispersion() {
    return (this._squaredSum / this._sampleSize) - Math.pow(this._sum / this._sampleSize, 2);
  }
}

export default DispersionCalculator;
