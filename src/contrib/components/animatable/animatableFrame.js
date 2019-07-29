class AnimatableFrame {
  constructor(config) {
    this._index = config.index;
    this._rotation = config.rotation;
    this._flipX = config.flipX;
    this._flipY = config.flipY;
  }

  set index(index) {
    this._index = index;
  }

  get index() {
    return this._index;
  }

  set rotation(rotation) {
    this._rotation = rotation;
  }

  get rotation() {
    return this._rotation;
  }

  set flipX(flipX) {
    this._flipX = flipX;
  }

  get flipX() {
    return this._flipX;
  }

  set flipY(flipY) {
    this._flipY = flipY;
  }

  get flipY() {
    return this._flipY;
  }

  clone() {
    return new AnimatableFrame({
      index: this.index,
      rotation: this.rotation,
      flipX: this.flipX,
      flipY: this.flipY,
    });
  }
}

export default AnimatableFrame;
