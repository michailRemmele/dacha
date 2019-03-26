class Renderable {
  constructor(config) {
    this._src = config.src;
    this._width = config.width;
    this._height = config.height;
  }

  set src(src) {
    this._src = src;
  }

  get src() {
    return this._src;
  }

  set width(width) {
    this._width = width;
  }

  get width() {
    return this._width;
  }

  set height(height) {
    this._height = height;
  }

  get height() {
    return this._height;
  }

  clone() {
    return new Renderable({
      src: this.src,
      width: this.width,
      height: this.height,
    });
  }
}

export default Renderable;
