import { Component } from '../../../engine/component';

export interface ColliderConfig {
  type: 'box' | 'circle'
  centerX: number;
  centerY: number;
  sizeX?: number;
  sizeY?: number;
  radius?: number;
}

export class Collider extends Component {
  type: 'box' | 'circle';

  centerX: number;
  centerY: number;

  sizeX?: number;
  sizeY?: number;

  radius?: number;

  constructor(config: ColliderConfig) {
    super();

    this.type = config.type;

    this.centerX = config.centerX;
    this.centerY = config.centerY;

    this.sizeX = config.sizeX;
    this.sizeY = config.sizeY;

    this.radius = config.radius;
  }

  clone(): Collider {
    return new Collider({
      type: this.type,
      centerX: this.centerX,
      centerY: this.centerY,
      sizeX: this.sizeX,
      sizeY: this.sizeY,
      radius: this.radius,
    });
  }
}

Collider.componentName = 'Collider';
