class Rectangle {
  constructor(width, height) {
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

export default Rectangle;
