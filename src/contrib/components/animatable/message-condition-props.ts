interface ComparatorConditionPropsConfig {
  message: string;
}

export class MessageConditionProps {
  message: string;

  constructor(config: unknown) {
    this.message = (config as ComparatorConditionPropsConfig).message;
  }
}
