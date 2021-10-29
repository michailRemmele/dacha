import { Component } from '../../../engine/component';

class Renderable extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this._src = config.src;
    this._width = config.width;
    this._height = config.height;
    this._type = config.type;
    this._slice = config.slice;
    this._spacing = config.spacing || 0;
    this._extruding = config.extruding || 0;
    this._currentFrame = config.type === 'sprite' ? 0 : undefined;
    this._rotation = config.rotation;
    this._origin = config.origin;
    this._flipX = config.flipX;
    this._flipY = config.flipY;
    this._disabled = config.disabled;
    this._sortingLayer = config.sortingLayer;
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

  set spacing(spacing) {
    this._spacing = spacing;
  }

  get spacing() {
    return this._spacing;
  }

  set extruding(extruding) {
    this._extruding = extruding;
  }

  get extruding() {
    return this._extruding;
  }

  set currentFrame(currentFrame) {
    this._currentFrame = currentFrame;
  }

  get currentFrame() {
    return this._currentFrame;
  }

  set rotation(rotation) {
    this._rotation = rotation;
  }

  get rotation() {
    return this._rotation;
  }

  set origin(origin) {
    this._origin = origin;
  }

  get origin() {
    return [this._origin[0] - (this.width / 2), this._origin[1] - (this.height / 2)];
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

  set sortingLayer(sortingLayer) {
    this._sortingLayer = sortingLayer;
  }

  get sortingLayer() {
    return this._sortingLayer;
  }

  clone() {
    return new Renderable(this.componentName, {
      src: this.src,
      width: this.width,
      height: this.height,
      type: this.type,
      slice: this.slice,
      spacing: this.spacing,
      extruding: this.extruding,
      rotation: this.rotation,
      origin: this._origin,
      flipX: this.flipX,
      flipY: this.flipY,
      disabled: this.disabled,
      sortingLayer: this.sortingLayer,
    });
  }
}

export default Renderable;
