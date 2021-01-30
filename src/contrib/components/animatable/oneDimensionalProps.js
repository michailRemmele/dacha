const SEPARATOR = '.';

class OneDimensionalProps {
  constructor(config) {
    this._x = Array.isArray(config.x)
      ? config.x.slice(0)
      : config.x.split(SEPARATOR);
  }

  set x(x) {
    this._x = x;
  }

  get x() {
    return this._x;
  }
}

export default OneDimensionalProps;
