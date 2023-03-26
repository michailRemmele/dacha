import type { MessageConditionPropsConfig } from './types';

export class MessageConditionProps {
  message: string;

  constructor(config: unknown) {
    this.message = (config as MessageConditionPropsConfig).message;
  }
}
