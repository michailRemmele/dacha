export class CircleCollider {
  private _radius: number;
  private _centerX: number;
  private _centerY: number;

  constructor(config: Record<string, number>) {
    this._radius = config.radius;
    this._centerX = config.centerX;
    this._centerY = config.centerY;
  }

  set radius(radius) {
    this._radius = radius;
  }

  get radius() {
    return this._radius;
  }

  set centerX(centerX) {
    this._centerX = centerX;
  }

  get centerX() {
    return this._centerX;
  }

  set centerY(centerY) {
    this._centerY = centerY;
  }

  get centerY() {
    return this._centerY;
  }
}
