const SEPARATOR = '.';

class TwoDimensionalProps {
  constructor(config) {
    this._x = Array.isArray(config.x)
      ? config.x.slice(0)
      : config.x.split(SEPARATOR);
    this._y = Array.isArray(config.y)
      ? config.y.slice(0)
      : config.y.split(SEPARATOR);
  }

  set x(x) {
    this._x = x;
  }

  get x() {
    return this._x;
  }

  set y(y) {
    this._y = y;
  }

  get y() {
    return this._y;
  }
}

export default TwoDimensionalProps;
