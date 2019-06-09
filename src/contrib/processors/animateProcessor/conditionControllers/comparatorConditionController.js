import ConditionController from './conditionController';

class ComparatorConditionController extends ConditionController {
  constructor() {
    super();

    this._getters = {
      number: (value) => {
        if (typeof value !== 'number') {
          throw new Error('The value must be a number');
        }
        return value;
      },
      componentValue: (value, gameObject) => {
        const valuePath = value.split('.');
        const componentName = valuePath.shift();
        let soughtValue = gameObject.getComponent(componentName);
        for (let i = 0; i < valuePath.length; i++) {
          soughtValue = soughtValue[valuePath[i]];

          if (soughtValue === undefined) {
            return undefined;
          }
        }
        return soughtValue;
      },
    };
    this._operations = {
      equals: (arg1, arg2) => {
        return arg1 === arg2;
      },
      notEquals: (arg1, arg2) => {
        return arg1 !== arg2;
      },
      greater: (arg1, arg2) => {
        return arg1 > arg2;
      },
      less: (arg1, arg2) => {
        return arg1 < arg2;
      },
    };
  }

  _getValue(arg, gameObject) {
    if (!this._getters[arg.type]) {
      throw new Error('Unknown value type');
    }

    return this._getters[arg.type](arg.value, gameObject);
  }

  check(props) {
    const { gameObject, operation } = props;

    if (!this._operations[operation]) {
      throw new Error('Unknown operation type');
    }

    const arg1 = this._getValue(props.arg1, gameObject);
    const arg2 = this._getValue(props.arg2, gameObject);

    return this._operations[operation](arg1, arg2);
  }
}

export default ComparatorConditionController;
