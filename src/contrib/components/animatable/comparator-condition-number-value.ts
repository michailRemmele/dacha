import type { ComparatorConditionNumberValueConfig } from './types';

export class ComparatorConditionNumberValue {
  type: string;
  value: number;

  constructor(config: unknown) {
    const { type, value } = config as ComparatorConditionNumberValueConfig;

    this.type = type;
    this.value = value;
  }
}
