import { Condition } from './condition';
import type { TransitionConfig } from './types';

export class Transition {
  id: string;
  state: string;
  time: number;
  conditions: Condition[];

  constructor(config: TransitionConfig) {
    const {
      id,
      state,
      time,
      conditions = [],
    } = config;

    this.id = id;
    this.state = state;
    this.time = time;
    this.conditions = conditions.map((condition) => new Condition(condition));
  }
}
