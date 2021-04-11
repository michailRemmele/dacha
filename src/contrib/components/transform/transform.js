import Component from 'engine/component/component';

class Transform extends Component {
  constructor(config) {
    super();

    this._offsetX = config.offsetX;
    this._offsetY = config.offsetY;
    this._rotation = config.rotation;
    this._scaleX = config.scaleX || 1;
    this._scaleY = config.scaleY || 1;
  }

  set offsetX(offsetX) {
    this._offsetX = offsetX - (this._parent ? this._parent.offsetX : 0);
  }

  get offsetX() {
    return this._offsetX + (this._parent ? this._parent.offsetX : 0);
  }

  set offsetY(offsetY) {
    this._offsetY = offsetY - (this._parent ? this._parent.offsetY : 0);
  }

  get offsetY() {
    return this._offsetY + (this._parent ? this._parent.offsetY : 0);
  }

  set rotation(rotation) {
    this._rotation = rotation - (this._parent ? this._parent.rotation : 0);
  }

  get rotation() {
    return this._rotation + (this._parent ? this._parent.rotation : 0);
  }

  set scaleX(scaleX) {
    this._scaleX = scaleX / (this._parent ? this._parent.scaleX : 1);
  }

  get scaleX() {
    return this._scaleX * (this._parent ? this._parent.scaleX : 1);
  }

  set scaleY(scaleY) {
    this._scaleY = scaleY / (this._parent ? this._parent.scaleY : 1);
  }

  get scaleY() {
    return this._scaleY * (this._parent ? this._parent.scaleY : 1);
  }

  clone() {
    return new Transform({
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      rotation: this.rotation,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
    });
  }
}

export default Transform;
