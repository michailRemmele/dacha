import type { GameObject } from '../../../../engine/game-object';
import type { ComparatorConditionProps } from '../../../components/animatable/comparator-condition-props';
import type { ComparatorConditionComponentValue } from '../../../components/animatable/comparator-condition-component-value';
import type { ComparatorConditionNumberValue } from '../../../components/animatable/comparator-condition-number-value';
import { getValue } from '../utils';

import { ConditionController } from './condition-controller';

type GetterFn = (arg1: GameObject, arg2: string | number | Array<string>) => string | number;
type OperationFn = (arg1: string | number, arg2: string | number) => boolean;

const getters: Record<string, GetterFn> = {
  number: (arg1, value): string | number => {
    if (typeof value !== 'number') {
      throw new Error('The value must be a number');
    }
    return value;
  },
  componentValue: getValue as GetterFn,
};
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
    arg: ComparatorConditionComponentValue | ComparatorConditionNumberValue,
  ): string | number {
    if (!getters[arg.type]) {
      throw new Error(`Unknown value type: ${arg.type}`);
    }

    return getters[arg.type](gameObject, arg.value);
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
