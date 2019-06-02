class Transform {
  constructor(config) {
    this._offsetX = config.offsetX;
    this._offsetY = config.offsetY;
  }

  set offsetX(offsetX) {
    this._offsetX = offsetX;
  }

  get offsetX() {
    return this._offsetX;
  }

  set offsetY(offsetY) {
    this._offsetY = offsetY;
  }

  get offsetY() {
    return this._offsetY;
  }

  clone() {
    return new Transform({
      offsetX: this.offsetX,
      offsetY: this.offsetY,
    });
  }
}

export default Transform;
