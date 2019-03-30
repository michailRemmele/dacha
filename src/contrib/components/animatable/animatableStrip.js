class AnimatableStrip {
  constructor(config) {
    this._from = config.from;
    this._to = config.to;
  }

  set from(from) {
    this._from = from;
  }

  get from() {
    return this._from;
  }

  set to(to) {
    this._to = to;
  }

  get to() {
    return this._to;
  }

  clone() {
    return new AnimatableStrip({
      from: this.from,
      to: this.to,
    });
  }
}

export default AnimatableStrip;
