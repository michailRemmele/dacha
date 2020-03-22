const SEPARATOR = '.';

class ComparatorConditionNumberValue {
  constructor(config) {
    this._type = config.type;
    this._value = Array.isArray(config.value) ? config.value : config.value.split(SEPARATOR);
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

  clone() {
    return new ComparatorConditionNumberValue({
      type: this.type,
      value: this.value.slice(0),
    });
  }
}

export default ComparatorConditionNumberValue;
