class Transform {
  constructor(config) {
    this._rotation = config.rotation;
    this._offsetX = config._offsetX;
    this._offsetY = config._offsetY;
  }

  set rotation(rotation) {
    this._rotation = rotation;
  }

  get rotation() {
    return this._rotation;
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
      rotation: this.rotation,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
    });
  }
}

export default Transform;
