import type { GameObject } from '../../../../engine/game-object';
import type { ComparatorConditionProps } from '../../../components/animatable/comparator-condition-props';
import type { ComparatorConditionComponentValue } from '../../../components/animatable/comparator-condition-component-value';
import type { ComparatorConditionSimpleValue } from '../../../components/animatable/comparator-condition-number-value';
import { getValue as getComponentValue } from '../utils';

import { ConditionController } from './condition-controller';

type ComparatorValue = string | number | boolean;
type OperationFn = (arg1: ComparatorValue, arg2: ComparatorValue) => boolean;

const operations: Record<string, OperationFn> = {
  equals: (arg1, arg2): boolean => arg1 === arg2,
  notEquals: (arg1, arg2): boolean => arg1 !== arg2,
  greater: (arg1, arg2): boolean => arg1 > arg2,
  less: (arg1, arg2): boolean => arg1 < arg2,
  greaterOrEqual: (arg1, arg2): boolean => arg1 >= arg2,
  lessOrEqual: (arg1, arg2): boolean => arg1 <= arg2,
};

export class ComparatorConditionController implements ConditionController {
  private gameObject: GameObject;
  private props: ComparatorConditionProps;

  constructor(
    props: ComparatorConditionProps,
    gameObject: GameObject,
  ) {
    this.gameObject = gameObject;
    this.props = props;
  }

  private getValue(
    gameObject: GameObject,
    arg: ComparatorConditionComponentValue | ComparatorConditionSimpleValue,
  ): ComparatorValue {
    if (arg.type === 'componentValue') {
      return getComponentValue(gameObject, arg.value as Array<string>) as ComparatorValue;
    }

    return arg.value as ComparatorValue;
  }

  check(): boolean {
    const { operation } = this.props;

    if (!operations[operation]) {
      throw new Error(`Unknown operation type: ${operation}`);
    }

    const arg1 = this.getValue(this.gameObject, this.props.arg1);
    const arg2 = this.getValue(this.gameObject, this.props.arg2);

    return operations[operation](arg1, arg2);
  }
}
