import { conditionProps } from './condition-props';
import { ComparatorConditionProps } from './comparator-condition-props';
import { EventConditionProps } from './event-condition-props';
import type { ConditionConfig } from './types';

export class Condition {
  id: string;
  type: 'comparator' | 'event';
  props: ComparatorConditionProps | EventConditionProps;

  constructor(config: ConditionConfig) {
    const { id, type, props = {} } = config;

    this.id = id;
    this.type = type;
    this.props = new conditionProps[type](props);
  }
}
