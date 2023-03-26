import { conditionProps } from './condition-props';
import { ComparatorConditionProps } from './comparator-condition-props';
import { MessageConditionProps } from './message-condition-props';
import type { ConditionConfig } from './types';

export class Condition {
  type: 'comparator' | 'message';
  props: ComparatorConditionProps | MessageConditionProps;

  constructor(config: ConditionConfig) {
    const { type, props = {} } = config;

    this.type = type;
    this.props = new conditionProps[type](props);
  }
}
