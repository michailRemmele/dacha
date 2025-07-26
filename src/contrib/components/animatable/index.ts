import { Component } from '../../../engine/component';
import { State } from './state';
import { IndividualState } from './individual-state';
import { GroupState } from './group-state';
import type { AnimatableConfig, GroupStateConfig, IndividualStateConfig } from './types';

export type { AnimatableConfig };

export class Animatable extends Component {
  states: (IndividualState | GroupState)[];
  initialState: string;
  currentState?: IndividualState | GroupState;
  duration: number;

  constructor(config: AnimatableConfig) {
    super();

    const {
      initialState,
      states = [],
    } = config;

    this.states = states
      .reduce((acc: (IndividualState | GroupState)[], state) => {
        const { type } = state as State;
        if (type === 'individual') {
          acc.push(new IndividualState(state as IndividualStateConfig));
        }
        if (type === 'group') {
          acc.push(new GroupState(state as GroupStateConfig));
        }
        return acc;
      }, []);
    this.initialState = initialState;
    this.currentState = this.states.find((state) => state.id === this.initialState);

    this.duration = 0;
  }

  setCurrentState(currentState: string): void {
    const newState = this.states.find((state) => state.id === currentState);

    if (!newState) {
      throw new Error(`Can't find state with same name: ${currentState}`);
    }

    this.currentState = newState;
  }

  clone(): Animatable {
    return new Animatable({
      states: this.states,
      initialState: this.initialState,
    });
  }
}

Animatable.componentName = 'Animatable';
