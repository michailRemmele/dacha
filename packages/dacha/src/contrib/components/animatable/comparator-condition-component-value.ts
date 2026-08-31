import type { ComparatorConditionComponentValueConfig } from './types';

const SEPARATOR = '.';

export class ComparatorConditionComponentValue {
  type: string;
  value: string | string[];

  constructor(config: unknown) {
    const { value, type } = config as ComparatorConditionComponentValueConfig;

    this.type = type;
    this.value = Array.isArray(value)
      ? value.slice(0)
      : String(value).split(SEPARATOR);
  }
}
