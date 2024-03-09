import type { ComparatorConditionSimpleValueConfig } from './types';

export class ComparatorConditionSimpleValue {
  type: string;
  value: string | number | boolean;

  constructor(config: unknown) {
    const { type, value } = config as ComparatorConditionSimpleValueConfig;

    this.type = type;
    this.value = value;
  }
}
