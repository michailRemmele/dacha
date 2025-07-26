import { Transition } from './transition';
import type { StateConfig } from './types';

export class State {
  id: string;
  name: string;
  speed: number;
  type: 'individual' | 'group';
  transitions: Transition[];

  constructor(config: StateConfig) {
    const {
      id,
      name,
      speed,
      type,
      transitions = [],
    } = config;

    this.id = id;
    this.name = name;
    this.speed = speed;
    this.type = type;
    this.transitions = transitions.map((transition) => new Transition(transition));
  }
}
