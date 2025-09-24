import { Component } from '../../../engine/component';

export interface TransformConfig {
  offsetX: number
  offsetY: number
  offsetZ: number
  rotation: number
  scaleX: number
  scaleY: number
}

export class Transform extends Component {
  relativeOffsetX: number;
  relativeOffsetY: number;
  relativeOffsetZ: number;
  relativeRotation: number;
  relativeScaleX: number;
  relativeScaleY: number;

  constructor(config: TransformConfig) {
    super();

    this.relativeOffsetX = config.offsetX;
    this.relativeOffsetY = config.offsetY;
    this.relativeOffsetZ = config.offsetZ;
    this.relativeRotation = config.rotation;
    this.relativeScaleX = config.scaleX || 1;
    this.relativeScaleY = config.scaleY || 1;
  }

  _getPropertyFromParent(name: string, defaultValue: number): number {
    const parentComponent = this.getParentComponent() as Record<string, number> | undefined;
    return parentComponent ? parentComponent[name] : defaultValue;
  }

  set offsetX(offsetX) {
    this.relativeOffsetX = offsetX - this._getPropertyFromParent('offsetX', 0);
  }

  get offsetX(): number {
    return this.relativeOffsetX + this._getPropertyFromParent('offsetX', 0);
  }

  set offsetY(offsetY) {
    this.relativeOffsetY = offsetY - this._getPropertyFromParent('offsetY', 0);
  }

  get offsetY(): number {
    return this.relativeOffsetY + this._getPropertyFromParent('offsetY', 0);
  }

  set offsetZ(offsetZ) {
    this.relativeOffsetZ = offsetZ - this._getPropertyFromParent('offsetZ', 0);
  }

  get offsetZ(): number {
    return this.relativeOffsetZ + this._getPropertyFromParent('offsetZ', 0);
  }

  set rotation(rotation) {
    this.relativeRotation = rotation - this._getPropertyFromParent('rotation', 0);
  }

  get rotation(): number {
    return this.relativeRotation + this._getPropertyFromParent('rotation', 0);
  }

  set scaleX(scaleX) {
    this.relativeScaleX = scaleX / this._getPropertyFromParent('scaleX', 1);
  }

  get scaleX(): number {
    return this.relativeScaleX * this._getPropertyFromParent('scaleX', 1);
  }

  set scaleY(scaleY) {
    this.relativeScaleY = scaleY / this._getPropertyFromParent('scaleY', 1);
  }

  get scaleY(): number {
    return this.relativeScaleY * this._getPropertyFromParent('scaleY', 1);
  }

  clone(): Transform {
    return new Transform({
      offsetX: this.relativeOffsetX,
      offsetY: this.relativeOffsetY,
      offsetZ: this.relativeOffsetZ,
      rotation: this.relativeRotation,
      scaleX: this.relativeScaleX,
      scaleY: this.relativeScaleY,
    });
  }
}

Transform.componentName = 'Transform';
