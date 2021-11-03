export class BoxCollider {
  private _sizeX: number;
  private _sizeY: number;
  private _centerX: number;
  private _centerY: number;

  constructor(config: Record<string, number>) {
    this._sizeX = config.sizeX;
    this._sizeY = config.sizeY;
    this._centerX = config.centerX;
    this._centerY = config.centerY;
  }

  set sizeX(sizeX) {
    this._sizeX = sizeX;
  }

  get sizeX() {
    return this._sizeX;
  }

  set sizeY(sizeY) {
    this._sizeY = sizeY;
  }

  get sizeY() {
    return this._sizeY;
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
