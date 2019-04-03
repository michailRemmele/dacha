class Vector2 {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  add(vector) {
    this._x += vector.x;
    this._y += vector.y;
  }

  multiplyNumber(number) {
    this._x *= number;
    this._y *= number;
  }

  equals(vector) {
    return this._x === vector.x && this._y === vector.y;
  }

  clone() {
    return new Vector2(this._x, this._y);
  }
}

export default Vector2;
