export class Rectangle {
  private _width: number;
  private _height: number;

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
  }

  toArray() {
    const x1 = 0;
    const y1 = 0;
    const x2 = x1 + this._width;
    const y2 = y1 + this._height;

    return [
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ];
  }
}
