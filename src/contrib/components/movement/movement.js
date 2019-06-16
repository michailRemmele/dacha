class Movement {
  constructor(config) {
    this._speed = config.speed;
  }

  set speed(speed) {
    this._speed = speed;
  }

  get speed() {
    return this._speed;
  }

  clone() {
    return new Movement({
      speed: this.speed,
    });
  }
}

export default Movement;
