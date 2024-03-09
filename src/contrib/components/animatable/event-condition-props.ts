import type { EventConditionPropsConfig } from './types';

export class EventConditionProps {
  eventType: string;

  constructor(config: unknown) {
    this.eventType = (config as EventConditionPropsConfig).eventType;
  }
}
