import { Transition, TransitionConfig } from './transition';

export interface StateConfig {
  name: string;
  speed: number;
  type: 'individual' | 'group';
  transitions: Array<TransitionConfig>;
}

export class State {
  name: string;
  speed: number;
  type: 'individual' | 'group';
  transitions: Array<Transition>;

  constructor(config: StateConfig) {
    this.name = config.name;
    this.speed = config.speed;
    this.type = config.type;
    this.transitions = config.transitions.map((transition) => new Transition(transition));
  }
}
