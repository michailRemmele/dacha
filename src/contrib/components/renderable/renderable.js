class Renderable {
  constructor(config) {
    this._src = config.src;
    this._width = config.width;
    this._height = config.height;
    this._type = config.type;
    this._slice = config.slice;
    this._frameTags = config.frameTags;
    this._currentFrame = config.type === 'sprite' ? 0 : undefined;
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

  set type(type) {
    this._type = type;
  }

  get type() {
    return this._type;
  }

  set slice(slice) {
    this._slice = slice;
  }

  get slice() {
    return this._slice;
  }

  set frameTags(frameTags) {
    this._frameTags = frameTags;
  }

  get frameTags() {
    return this._frameTags;
  }

  set currentFrame(currentFrame) {
    this._currentFrame = currentFrame;
  }

  get currentFrame() {
    return this._currentFrame;
  }

  clone() {
    return new Renderable({
      src: this.src,
      width: this.width,
      height: this.height,
      type: this.type,
      slice: this.slice,
      frameTags: this.frameTags ? Object.keys(this.frameTags).reduce((storage, key) => {
        storage[key] = {
          ...this.frameTags[key],
        };
        return storage;
      }, {}) : undefined,
    });
  }
}

export default Renderable;
