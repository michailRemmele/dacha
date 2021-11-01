import { Component } from '../../../engine/component';

interface TransformConfig {
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export class Transform extends Component {
  private _offsetX: number;
  private _offsetY: number;
  private _offsetZ: number;
  private _rotation: number;
  private _scaleX: number;
  private _scaleY: number;

  constructor(componentName: string, config: TransformConfig) {
    super(componentName);

    this._offsetX = config.offsetX;
    this._offsetY = config.offsetY;
    this._offsetZ = config.offsetZ;
    this._rotation = config.rotation;
    this._scaleX = config.scaleX || 1;
    this._scaleY = config.scaleY || 1;
  }

  _getPropertyFromParent(name: string, defaultValue: number): number {
    const parentComponent = this.getParentComponent() as Record<string, number> | void;
    return parentComponent ? parentComponent[name] : defaultValue;
  }

  set relativeOffsetX(offsetX) {
    this._offsetX = offsetX;
  }

  get relativeOffsetX() {
    return this._offsetX;
  }

  set offsetX(offsetX) {
    this._offsetX = offsetX - this._getPropertyFromParent('offsetX', 0);
  }

  get offsetX() {
    return this._offsetX + this._getPropertyFromParent('offsetX', 0);
  }

  set relativeOffsetY(offsetY) {
    this._offsetY = offsetY;
  }

  get relativeOffsetY() {
    return this._offsetY;
  }

  set offsetY(offsetY) {
    this._offsetY = offsetY - this._getPropertyFromParent('offsetY', 0);
  }

  get offsetY() {
    return this._offsetY + this._getPropertyFromParent('offsetY', 0);
  }

  set relativeOffsetZ(offsetZ) {
    this._offsetZ = offsetZ;
  }

  get relativeOffsetZ() {
    return this._offsetZ;
  }

  set offsetZ(offsetZ) {
    this._offsetZ = offsetZ - this._getPropertyFromParent('offsetZ', 0);
  }

  get offsetZ() {
    return this._offsetZ + this._getPropertyFromParent('offsetZ', 0);
  }

  set relativeRotation(rotation) {
    this._rotation = rotation;
  }

  get relativeRotation() {
    return this._rotation;
  }

  set rotation(rotation) {
    this._rotation = rotation - this._getPropertyFromParent('rotation', 0);
  }

  get rotation() {
    return this._rotation + this._getPropertyFromParent('rotation', 0);
  }

  set relativeScaleX(scaleX) {
    this._scaleX = scaleX;
  }

  get relativeScaleX() {
    return this._scaleX;
  }

  set scaleX(scaleX) {
    this._scaleX = scaleX / this._getPropertyFromParent('scaleX', 1);
  }

  get scaleX() {
    return this._scaleX * this._getPropertyFromParent('scaleX', 1);
  }

  set relativeScaleY(scaleY) {
    this._scaleY = scaleY;
  }

  get relativeScaleY() {
    return this._scaleY;
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
