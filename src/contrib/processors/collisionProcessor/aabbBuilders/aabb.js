class AABB {
  constructor(point, rx, ry) {
    this._point = point;
    this._rx = rx;
    this._ry = ry;
  }

  set point(point) {
    this._point = point;
  }

  get point() {
    return this._point;
  }

  set rx(rx) {
    this._rx = rx;
  }

  get rx() {
    return this._rx;
  }

  set ry(ry) {
    this._ry = ry;
  }

  get ry() {
    return this._ry;
  }
}

export default AABB;
