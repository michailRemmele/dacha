class AnimatableFrame {
  constructor(config) {
    this._index = config.index;
    this._rotation = config.rotation;
    this._flipX = config.flipX;
    this._flipY = config.flipY;
    this._disabled = config.disabled;
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

  set disabled(disabled) {
    this._disabled = disabled;
  }

  get disabled() {
    return this._disabled;
  }

  clone() {
    return new AnimatableFrame({
      index: this.index,
      rotation: this.rotation,
      flipX: this.flipX,
      flipY: this.flipY,
      disabled: this.disabled,
    });
  }
}

export default AnimatableFrame;
