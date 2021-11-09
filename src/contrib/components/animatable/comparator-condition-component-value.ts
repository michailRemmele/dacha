interface ComparatorConditionComponentValueConfig {
  type: string;
  value: string | Array<string>;
}

const SEPARATOR = '.';

export class ComparatorConditionComponentValue {
  type: string;
  value: string | Array<string>;

  constructor(config: unknown) {
    const { value, type } = config as ComparatorConditionComponentValueConfig;

    this.type = type;
    this.value = Array.isArray(value)
      ? value.slice(0)
      : value.split(SEPARATOR);
  }
}
