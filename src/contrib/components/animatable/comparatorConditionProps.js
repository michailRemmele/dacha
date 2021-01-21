import comparatorConditionValues from './comparatorConditionValues';

class ComparatorConditionProps {
  constructor(config) {
    this._operation = config.operation;
    this._arg1 = new comparatorConditionValues[config.arg1.type](config.arg1);
    this._arg2 = new comparatorConditionValues[config.arg2.type](config.arg2);
  }

  set operation(operation) {
    this._operation = operation;
  }

  get operation() {
    return this._operation;
  }

  set arg1(arg1) {
    this._arg1 = arg1;
  }

  get arg1() {
    return this._arg1;
  }

  set arg2(arg2) {
    this._arg2 = arg2;
  }

  get arg2() {
    return this._arg2;
  }
}

export default ComparatorConditionProps;
