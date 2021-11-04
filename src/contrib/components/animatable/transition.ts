import { Condition, ConditionConfig } from './condition';

export interface TransitionConfig {
  state: string;
  time: number;
  conditions: Array<ConditionConfig>;
}

export class Transition {
  state: string;
  time: number;
  conditions: Array<Condition>;

  constructor(config: TransitionConfig) {
    this.state = config.state;
    this.time = config.time;
    this.conditions = config.conditions.map((condition) => new Condition(condition));
  }
}
