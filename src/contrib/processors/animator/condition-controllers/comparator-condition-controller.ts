import type { GameObject } from '../../../../engine/gameObject';
import type { ComparatorConditionProps } from '../../../components/animatable/comparator-condition-props';
import type { ComparatorConditionComponentValue } from '../../../components/animatable/comparator-condition-component-value';
import type { ComparatorConditionNumberValue } from '../../../components/animatable/comparator-condition-number-value';
import { getValue } from '../utils';

import { ConditionController } from './condition-controller';

type GetterFn = (arg1: GameObject, arg2: string | number | Array<string>) => string | number;
type OperationFn = (arg1: string | number, arg2: string | number) => boolean;

export class ComparatorConditionController implements ConditionController {
  private getters: Record<string, GetterFn>;
  private operations: Record<string, OperationFn>;

  constructor() {
    this.getters = {
      number: (value): string | number => {
        if (typeof value !== 'number') {
          throw new Error('The value must be a number');
        }
        return value;
      },
      componentValue: getValue as GetterFn,
    };
    this.operations = {
      equals: (arg1, arg2): boolean => arg1 === arg2,
      notEquals: (arg1, arg2): boolean => arg1 !== arg2,
      greater: (arg1, arg2): boolean => arg1 > arg2,
      less: (arg1, arg2): boolean => arg1 < arg2,
      greaterOrEqual: (arg1, arg2): boolean => arg1 >= arg2,
      lessOrEqual: (arg1, arg2): boolean => arg1 <= arg2,
    };
  }

  private getValue(
    gameObject: GameObject,
    arg: ComparatorConditionComponentValue | ComparatorConditionNumberValue,
  ): string | number {
    if (!this.getters[arg.type]) {
      throw new Error(`Unknown value type: ${arg.type}`);
    }

    return this.getters[arg.type](gameObject, arg.value);
  }

  check(props: ComparatorConditionProps, gameObject: GameObject): boolean {
    const { operation } = props;

    if (!this.operations[operation]) {
      throw new Error(`Unknown operation type: ${operation}`);
    }

    const arg1 = this.getValue(gameObject, props.arg1);
    const arg2 = this.getValue(gameObject, props.arg2);

    return this.operations[operation](arg1, arg2);
  }
}
