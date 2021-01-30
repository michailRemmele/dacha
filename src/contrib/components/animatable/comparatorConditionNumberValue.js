class ComparatorConditionNumberValue {
  constructor(config) {
    this._type = config.type;
    this._value = config.value;
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
