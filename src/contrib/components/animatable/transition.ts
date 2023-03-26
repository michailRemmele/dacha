import { Condition } from './condition';
import type { TransitionConfig } from './types';

export class Transition {
  state: string;
  time: number;
  conditions: Array<Condition>;

  constructor(config: TransitionConfig) {
    const {
      state,
      time,
      conditions = [],
    } = config;

    this.state = state;
    this.time = time;
    this.conditions = conditions.map((condition) => new Condition(condition));
  }
}
