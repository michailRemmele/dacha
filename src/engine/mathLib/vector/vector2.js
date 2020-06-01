export class Vector2 {
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

  get magnitude() {
    return Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2));
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
