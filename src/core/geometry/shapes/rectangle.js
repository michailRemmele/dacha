class Rectangle {
  constructor(x, y, width, height) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }

  toArray() {
    const x1 = this._x;
    const y1 = this._y;
    const x2 = this._x + this._width;
    const y2 = this._y + this._height;

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

export default Rectangle;
