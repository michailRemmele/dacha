class AABB {
  constructor(min, max) {
    this._min = min;
    this._max = max;
  }

  set min(min) {
    this._min = min;
  }

  get min() {
    return this._min;
  }

  set max(max) {
    this._max = max;
  }

  get max() {
    return this._max;
  }
}

export default AABB;
