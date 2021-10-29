import { Component } from '../../../engine/component';

class Transform extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this._offsetX = config.offsetX;
    this._offsetY = config.offsetY;
    this._offsetZ = config.offsetZ;
    this._rotation = config.rotation;
    this._scaleX = config.scaleX || 1;
    this._scaleY = config.scaleY || 1;
  }

  _getPropertyFromParent(name, defaultValue) {
    const parentComponent = this.getParentComponent();
    return parentComponent ? parentComponent[name] : defaultValue;
  }

  set offsetX(offsetX) {
    this._offsetX = offsetX - this._getPropertyFromParent('offsetX', 0);
  }

  get offsetX() {
    return this._offsetX + this._getPropertyFromParent('offsetX', 0);
  }

  set offsetY(offsetY) {
    this._offsetY = offsetY - this._getPropertyFromParent('offsetY', 0);
  }

  get offsetY() {
    return this._offsetY + this._getPropertyFromParent('offsetY', 0);
  }

  set offsetZ(offsetZ) {
    this._offsetZ = offsetZ - this._getPropertyFromParent('offsetZ', 0);
  }

  get offsetZ() {
    return this._offsetZ + this._getPropertyFromParent('offsetZ', 0);
  }

  set rotation(rotation) {
    this._rotation = rotation - this._getPropertyFromParent('rotation', 0);
  }

  get rotation() {
    return this._rotation + this._getPropertyFromParent('rotation', 0);
  }

  set scaleX(scaleX) {
    this._scaleX = scaleX / this._getPropertyFromParent('scaleX', 1);
  }

  get scaleX() {
    return this._scaleX * this._getPropertyFromParent('scaleX', 1);
  }

  set scaleY(scaleY) {
    this._scaleY = scaleY / this._getPropertyFromParent('scaleY', 1);
  }

  get scaleY() {
    return this._scaleY * this._getPropertyFromParent('scaleY', 1);
  }

  clone() {
    return new Transform(this.componentName, {
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      offsetZ: this.offsetZ,
      rotation: this.rotation,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
    });
  }
}

export default Transform;
