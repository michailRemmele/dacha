const SEPARATOR = '.';

class ComparatorConditionNumberValue {
  constructor(config) {
    this._type = config.type;
    this._value = Array.isArray(config.value)
      ? config.value.slice(0)
      : config.value.split(SEPARATOR);
  }

  set type(type) {
    this._type = type;
  }

  get type() {
    return this._type;
  }

  set value(value) {
    this._value = value;
  }

  get value() {
    return this._value;
  }
}

export default ComparatorConditionNumberValue;
