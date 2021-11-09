import { conditionProps } from './condition-props';
import { ComparatorConditionProps } from './comparator-condition-props';
import { MessageConditionProps } from './message-condition-props';

export interface ConditionConfig {
  type: 'comparator' | 'message';
  props: Record<string, unknown>;
}

export class Condition {
  type: 'comparator' | 'message';
  props: ComparatorConditionProps | MessageConditionProps;

  constructor(config: ConditionConfig) {
    this.type = config.type;
    this.props = new conditionProps[config.type](config.props);
  }
}
